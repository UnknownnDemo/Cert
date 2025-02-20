// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract InstituteRegistration {
    struct Institute {
        string name;
        uint256 registrationTime;
        bool exists;
    }

    mapping(address => Institute) public institutes;

    event InstituteRegistered(address indexed instituteAddress, string name, uint256 registrationTime);

    function registerInstitute(string memory _name) public {
        require(!institutes[msg.sender].exists, "Institute already registered");

        institutes[msg.sender] = Institute({
            name: _name,
            registrationTime: block.timestamp,
            exists: true
        });

        emit InstituteRegistered(msg.sender, _name, block.timestamp);
    }

    function isRegistered(address _institute) public view returns (bool) {
        return institutes[_institute].exists;
    }
}
