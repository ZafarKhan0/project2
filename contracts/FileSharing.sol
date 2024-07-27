pragma solidity ^0.8.0;

contract FileSharing {
    struct File {
        string fileHash;
        address owner;
        mapping(address => bool) permissions;
    }

    mapping(string => File) private files;

    event FileUploaded(string fileHash, address owner);
    event PermissionGranted(string fileHash, address grantee);
    event PermissionRevoked(string fileHash, address revokee);

    function uploadFile(string memory fileHash) public {
        files[fileHash].owner = msg.sender;
        emit FileUploaded(fileHash, msg.sender);
    }

    function grantPermission(string memory fileHash, address grantee) public {
        require(files[fileHash].owner == msg.sender, "Only owner can grant permissions");
        files[fileHash].permissions[grantee] = true;
        emit PermissionGranted(fileHash, grantee);
    }

    function revokePermission(string memory fileHash, address revokee) public {
        require(files[fileHash].owner == msg.sender, "Only owner can revoke permissions");
        files[fileHash].permissions[revokee] = false;
        emit PermissionRevoked(fileHash, revokee);
    }

    function checkPermission(string memory fileHash, address user) public view returns (bool) {
        return files[fileHash].permissions[user] || files[fileHash].owner == user;
    }
}
