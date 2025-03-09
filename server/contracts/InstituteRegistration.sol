// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract InstituteRegistration {
//     struct Institute {
//         string name;
//         uint256 registrationTime;
//         bool exists;
//     }

//     mapping(address => Institute) public institutes;

//     event InstituteRegistered(address indexed instituteAddress, string name, uint256 registrationTime);

//     function registerInstitute(string memory _name) public {
//         require(!institutes[msg.sender].exists, "Institute already registered");

//         institutes[msg.sender] = Institute({
//             name: _name,
//             registrationTime: block.timestamp,
//             exists: true
//         });

//         emit InstituteRegistered(msg.sender, _name, block.timestamp);
//     }

//     function isRegistered(address _institute) public view returns (bool) {
//         return institutes[_institute].exists;
//     }
// }


pragma solidity ^0.8.0;

contract InstituteRegistration {
    address public owner;

    struct Institute {
        string name;
        string acronym;
        string website;
        uint256 registrationTime;
        bool exists;
    }

    struct Course {
        string courseName;
    }

    mapping(address => Institute) public institutes;
    mapping(address => Course[]) public instituteCourses;

    event InstituteRegistered(address indexed instituteAddress, string name, uint256 registrationTime);
    event CourseAdded(address indexed instituteAddress, string courseName);

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized: Only owner can add institutes");
        _;
    }

    modifier onlyRegisteredInstitute() {
        require(institutes[msg.sender].exists, "Only registered institutes can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    function registerInstitute(
        address _instituteAddress,
        string memory _name,
        string memory _acronym,
        string memory _website
    ) public onlyOwner {
        require(!institutes[_instituteAddress].exists, "Institute already registered");
        require(bytes(_name).length > 0, "Institute name cannot be empty");
        require(bytes(_acronym).length > 0, "Acronym cannot be empty");
        require(bytes(_website).length > 0, "Website cannot be empty");

        institutes[_instituteAddress] = Institute({
            name: _name,
            acronym: _acronym,
            website: _website,
            registrationTime: block.timestamp,
            exists: true
        });

        emit InstituteRegistered(_instituteAddress, _name, block.timestamp);
    }

    function addCourse(string memory _courseName) public onlyRegisteredInstitute {
        require(bytes(_courseName).length > 0, "Course name cannot be empty");

        instituteCourses[msg.sender].push(Course({ courseName: _courseName }));

        emit CourseAdded(msg.sender, _courseName);
    }

    function isRegistered(address _institute) public view returns (bool) {
        return institutes[_institute].exists;
    }

    function getInstitute(address _instituteAddress) public view returns (
        string memory name,
        string memory acronym,
        string memory website,
        uint256 registrationTime
    ) {
        require(institutes[_instituteAddress].exists, "Institute not found");
        
        Institute memory inst = institutes[_instituteAddress];
        return (inst.name, inst.acronym, inst.website, inst.registrationTime);
    }

    function getCourses(address _instituteAddress) public view returns (Course[] memory) {
        require(institutes[_instituteAddress].exists, "Institute not found");
        
        return instituteCourses[_instituteAddress];
    }
}
