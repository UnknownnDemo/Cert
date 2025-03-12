// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateIssuer {
    address public owner;

    struct Certificate {
        string instituteName;
        string department;
        string firstName;
        string lastName;
        string certificantId;
        string email;
        string courseCompleted;
        uint256 completionDate;
        string notes;
        string ipfsHash;
        bool isValid;
    }

    mapping(bytes32 => Certificate) public certificates;
    event CertificateIssued(
        bytes32 indexed certHash, 
        string instituteName, 
        string department, 
        string firstName, 
        string lastName, 
        string certificantId, 
        string email, 
        string courseCompleted, 
        uint256 completionDate, 
        string notes, 
        string ipfsHash
    );
    event CertificateRevoked(bytes32 indexed certHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory instituteName,
        string memory department,
        string memory firstName,
        string memory lastName,
        string memory certificantId,
        string memory email,
        string memory courseCompleted,
        uint256 completionDate,
        string memory notes,
        string memory ipfsHash
    ) public onlyOwner {
        bytes32 certHash = keccak256(abi.encodePacked(
            instituteName, department, firstName, lastName, certificantId, email, courseCompleted, completionDate, notes, ipfsHash
        ));
        certificates[certHash] = Certificate(
            instituteName, department, firstName, lastName, certificantId, email, courseCompleted, completionDate, notes, ipfsHash, true
        );
        emit CertificateIssued(certHash, instituteName, department, firstName, lastName, certificantId, email, courseCompleted, completionDate, notes, ipfsHash);
    }

    function revokeCertificate(bytes32 certHash) public onlyOwner {
        require(certificates[certHash].isValid, "Certificate does not exist or is already revoked");
        certificates[certHash].isValid = false;
        emit CertificateRevoked(certHash);
    }

    function verifyCertificate(bytes32 certHash) public view returns (
        bool, string memory, string memory, string memory, string memory, string memory, string memory, string memory, uint256, string memory, string memory
    ) {
        Certificate memory cert = certificates[certHash];
        return (
            cert.isValid, cert.instituteName, cert.department, cert.firstName, cert.lastName, cert.certificantId, cert.email, cert.courseCompleted, cert.completionDate, cert.notes, cert.ipfsHash
        );
    }
}
