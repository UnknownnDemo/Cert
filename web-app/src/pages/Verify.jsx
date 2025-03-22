import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InstituteRegistration from '../../../server/artifacts/contracts/InstituteRegistration.sol/InstituteRegistration.json';
import { useSearchParams } from "react-router-dom";

const styles = {
  container: {
    minHeight: '100vh',
    backgroundImage: 'url("../assets/back.jpeg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  verificationWrapper: {
    maxWidth: '700px',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    padding: '16px',
    backdropFilter: 'blur(12px)',
    maxHeight: '85vh',
    overflowY: 'auto'
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid #e5e5e5'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#666',
    fontSize: '14px'
  },
  form: {
    padding: '24px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#2563eb',
    border: 'none',
    color: 'white',
    marginTop: '16px',
    width: '100%'
  },
  revokeButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#DC2626',
    border: 'none',
    color: 'white',
    marginTop: '16px',
    width: '100%'
  },
  connectButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#047857',
    border: 'none',
    color: 'white',
    marginTop: '16px',
    width: '100%'
  },
  certificateDisplay: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  certificateTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    textAlign: 'center'
  },
  certificateField: {
    marginBottom: '12px',
    padding: '8px',
    borderBottom: '1px solid #eee'
  },
  fieldLabel: {
    fontWeight: '500',
    color: '#666',
    marginRight: '8px',
    display: 'inline-block',
    width: '140px'
  },
  fieldValue: {
    color: '#333',
    fontWeight: '400'
  },
  validBadge: {
    backgroundColor: '#10B981',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginLeft: '8px'
  },
  revokedBadge: {
    backgroundColor: '#EF4444',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'inline-block',
    marginLeft: '8px'
  },
  loadingSpinner: {
    display: 'flex',
    justifyContent: 'center',
    padding: '24px'
  },
  errorMessage: {
    color: '#EF4444',
    marginTop: '16px',
    padding: '8px',
    backgroundColor: '#FEE2E2',
    borderRadius: '4px'
  },
  successMessage: {
    color: '#047857',
    marginTop: '16px',
    padding: '8px',
    backgroundColor: '#D1FAE5',
    borderRadius: '4px'
  },
  walletStatus: {
    padding: '8px 16px',
    margin: '0 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '4px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};

const contractABI = InstituteRegistration.abi;
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const paramValue = searchParams.get("hash"); // Get 'hash' from URL
  const [certHash, setCertHash] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectedAccount, setConnectedAccount] = useState('');
  const [isIssuer, setIsIssuer] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
    
    // Setup listeners for wallet connections/disconnections
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  useEffect(() => {
    if (paramValue) {
      setCertHash(paramValue);
    }
  }, [paramValue]);

  // Check if the connected wallet is the certificate issuer whenever the certificate or connected account changes
  useEffect(() => {
    if (certificate && connectedAccount) {
      checkIssuerStatus();
    } else {
      setIsIssuer(false);
    }
  }, [certificate, connectedAccount]);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setConnectedAccount(accounts[0]);
    } else {
      setConnectedAccount('');
    }
  };

  const checkWalletConnection = async () => {
    if (!window.ethereum) return;
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setConnectedAccount(accounts[0]);
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to connect your wallet");
      return;
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };
  
  const checkIssuerStatus = async () => {
    if (!certHash || !connectedAccount) return;

    try {
      const provider = getProvider();
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      
      // Access the certificate directly using the certificates mapping
      const certData = await contract.certificates(certHash);
      
      // Check if the connected wallet is the issuer
      setIsIssuer(certData[11] && certData[11].toLowerCase() === connectedAccount.toLowerCase());
    } catch (error) {
      console.error("Error checking issuer status:", error);
      setIsIssuer(false);
    }
  };

  const getProvider = () => {
    // For read-only operations, use a JsonRpcProvider
    const network = import.meta.env.REACT_APP_ALCHEMY_URL || "https://rpc-amoy.polygon.technology";
    try{
      return new ethers.JsonRpcProvider(network);
    }
    catch(error){
      console.error("Error creating provider:", error);
    // Fallback to public RPC if your Alchemy URL fails
      return new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology")
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    setCertificate(null);
    setIsIssuer(false);

    try {
      if (!certHash) {
        throw new Error('Please enter a certificate key');
      }

      const provider = getProvider();
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      //add network verification
      const network = await provider.getNetwork();
      console.log("Connected to network:", network);

      // Using the verifyCertificate function from your contract
      const certificateData = await contract.verifyCertificate(certHash);
      
      // Check if the certificate exists (validate that instituteName is not empty)
      if (!certificateData || !certificateData[1]) {
        throw new Error('Certificate not found');
      }
    // Add network verification

      // Format the certificate data based on the return values from verifyCertificate
      const formattedCertificate = {
        isValid: certificateData[0],
        instituteName: certificateData[1],
        department: certificateData[2],
        firstName: certificateData[3],
        lastName: certificateData[4],
        certificantId: certificateData[5],
        email: certificateData[6],
        courseCompleted: certificateData[7],
        completionDate: new Date(Number(certificateData[8]) * 1000).toLocaleDateString(),
        notes: certificateData[9],
        ipfsHash: certificateData[10]
      };

      setCertificate(formattedCertificate);
      
      // If a wallet is connected, check if it's the issuer
      if (connectedAccount) {
        checkIssuerStatus();
      }
    } catch (error) {
      console.error("Error verifying certificate:", error);
      setError(error.message || 'Failed to verify certificate. Please check the certificate key and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeCertificate = async () => {
    if (!window.ethereum) {
      alert("Please connect to MetaMask");
      return;
    }
    
    if (!isIssuer) {
      alert("Only the certificate issuer can revoke this certificate");
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tx = await contract.revokeCertificate(certHash);
      await tx.wait();
      
      setSuccess(`Certificate with hash ${certHash} has been successfully revoked.`);
      
      // Refresh certificate data to show the updated status
      const updatedCertificateData = await contract.verifyCertificate(certHash);
      const updatedCertificate = {
        isValid: updatedCertificateData[0],
        instituteName: updatedCertificateData[1],
        department: updatedCertificateData[2],
        firstName: updatedCertificateData[3],
        lastName: updatedCertificateData[4],
        certificantId: updatedCertificateData[5],
        email: updatedCertificateData[6],
        courseCompleted: updatedCertificateData[7],
        completionDate: new Date(Number(updatedCertificateData[8]) * 1000).toLocaleDateString(),
        notes: updatedCertificateData[9],
        ipfsHash: updatedCertificateData[10]
      };
      
      setCertificate(updatedCertificate);
    } catch (error) {
      console.error("Error revoking certificate:", error);
      setError("Failed to revoke certificate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.verificationWrapper}>
        <div style={styles.header}>
          <h1 style={styles.title}>Certificate Verification</h1>
          <p style={styles.subtitle}>Enter the certificate key to verify authenticity</p>
        </div>

        {/* Wallet connection section */}
        <div style={styles.walletStatus}>
          {connectedAccount ? (
            <div>
              <span>Connected: {`${connectedAccount.substring(0, 6)}...${connectedAccount.substring(connectedAccount.length - 4)}`}</span>
            </div>
          ) : (
            <div>
              <button onClick={connectWallet} style={styles.connectButton}>
                Connect Wallet
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleVerify} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="certHash">
              Certificate Key
            </label>
            <input
              style={styles.input}
              type="text"
              id="certHash"
              value={certHash}
              onChange={(e) => setCertHash(e.target.value)}
              placeholder="Enter certificate key (certHash)"
              required
            />
          </div>

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Verify Certificate'}
          </button>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {success && <div style={styles.successMessage}>{success}</div>}
        </form>

        {isLoading && (
          <div style={styles.loadingSpinner}>
            <p>Loading certificate information...</p>
          </div>
        )}

        {certificate && (
          <div style={styles.certificateDisplay}>
            <h2 style={styles.certificateTitle}>
              Certificate 
              {certificate.isValid ? 
                <span style={styles.validBadge}>VALID</span> : 
                <span style={styles.revokedBadge}>REVOKED</span>
              }
            </h2>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Institution:</span>
              <span style={styles.fieldValue}>{certificate.instituteName}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Department:</span>
              <span style={styles.fieldValue}>{certificate.department}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Recipient:</span>
              <span style={styles.fieldValue}>{certificate.firstName} {certificate.lastName}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>ID:</span>
              <span style={styles.fieldValue}>{certificate.certificantId}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Email:</span>
              <span style={styles.fieldValue}>{certificate.email}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Course:</span>
              <span style={styles.fieldValue}>{certificate.courseCompleted}</span>
            </div>

            <div style={styles.certificateField}>
              <span style={styles.fieldLabel}>Completion Date:</span>
              <span style={styles.fieldValue}>{certificate.completionDate}</span>
            </div>

            {certificate.notes && (
              <div style={styles.certificateField}>
                <span style={styles.fieldLabel}>Notes:</span>
                <span style={styles.fieldValue}>{certificate.notes}</span>
              </div>
            )}

            {certificate.ipfsHash && certificate.ipfsHash !== "N/A" && (
              <div style={styles.certificateField}>
                <span style={styles.fieldLabel}>IPFS Hash:</span>
                <span style={styles.fieldValue}>{certificate.ipfsHash}</span>
              </div>
            )}

            {/* Revoke button - only shown if connected wallet is the certificate issuer and certificate is valid */}
            {isIssuer && certificate.isValid && (
              <button 
                onClick={handleRevokeCertificate} 
                style={styles.revokeButton}
                disabled={isLoading}
              >
                {isLoading ? 'Revoking...' : 'Revoke Certificate'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;