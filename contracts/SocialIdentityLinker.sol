pragma solidity ^0.4.16;

contract SocialIdentityLinker {
    struct SocialIdentity {
        address walletAddress;
        string firstName;
        string lastName;
        string emailAddress;
    }

    mapping (string => SocialIdentity) facebookIdentity;

    function setIdentity(
        string facebookId,
        string firstName,
        string lastName,
        string emailAddress
    ) {
        // set mapping entry at facebook ID to provided data
        // this operation can create new or overwrite previous data
        facebookIdentity[facebookId] = SocialIdentity({
            walletAddress: msg.sender, // can only set identity to a wallet you own
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress
        });
    }
}