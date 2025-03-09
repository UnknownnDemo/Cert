pragma solidity ^0.8.28;

import "./Certification.sol";

contract Institution {
    // State Variables
    address public owner;

    // Mappings
    mapping(address => Institute) private institutes; // Institutes Mapping
    mapping(address => Course[]) private instituteCourses; // Courses Mapping

    // Events
    event InstituteAdded(string indexed instituteName);

    constructor() {
        owner = msg.sender;
    }

    struct Course {
        string course_name;
        // Other attributes can be added
    }

    struct Institute {
        string institute_name;
        string institute_acronym;
        string institute_link;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(source));
    }

    function addInstitute(
        address _address,
        string memory _institute_name,
        string memory _institute_acronym,
        string memory _institute_link,
        Course[] memory _institute_courses
    ) public returns (bool) {
        require(msg.sender == owner, "Unauthorized: Only owner can add institutes");

        require(bytes(institutes[_address].institute_name).length == 0, "Institute already exists");
        require(_institute_courses.length > 0, "At least one course must be added");

        institutes[_address] = Institute(_institute_name, _institute_acronym, _institute_link);

        for (uint256 i = 0; i < _institute_courses.length; i++) {
            instituteCourses[_address].push(_institute_courses[i]);
        }

        emit InstituteAdded(_institute_name);
        return true;
    }

    function getInstituteData() public view returns (
        string memory, string memory, string memory, Course[] memory
    ) {
        Institute memory temp = institutes[msg.sender];
        require(bytes(temp.institute_name).length > 0, "Institute account does not exist");

        return (
            temp.institute_name,
            temp.institute_acronym,
            temp.institute_link,
            instituteCourses[msg.sender]
        );
    }

    function getInstituteData(address _address) public view returns (
        string memory, string memory, string memory, Course[] memory
    ) {
        require(msg.sender == owner || Certification(msg.sender).owner() == owner, "Unauthorized contract access");
        
        Institute memory temp = institutes[_address];
        require(bytes(temp.institute_name).length > 0, "Institute does not exist");

        return (
            temp.institute_name,
            temp.institute_acronym,
            temp.institute_link,
            instituteCourses[_address]
        );
    }

    function checkInstitutePermission(address _address) public view returns (bool) {
        return bytes(institutes[_address].institute_name).length > 0;
    }
}
