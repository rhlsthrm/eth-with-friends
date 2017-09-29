pragma solidity ^0.4.16;

contract SocialIdentityLinker {
    //state variables
    address public owner;
    uint256 public totalIdentities ;
    mapping (uint256 => SocialIdentity) facebookIdentity;

    //structs
    struct SocialIdentity {
        address walletAddress;
        string firstName;
        string lastName;
        string emailAddress;
    }

    //constructor
    modifier checkOwner() {require(owner == msg.sender); _ ;}


    //events
    event EventSetIdentity(uint256 facebookId);


    //core functions
    function SocialIdentityLinker() {
        totalIdentities = 0;
    }

    function setIdentity(
        uint256 facebookId,
        string firstName,
        string lastName,
        string emailAddress
    ) returns (bool)
    {
        // set mapping entry at facebook ID to provided data
        // this operation can create new or overwrite previous data
        facebookIdentity[facebookId] = SocialIdentity({
            // can only set identity to a wallet you own
            walletAddress: msg.sender,
            firstName: firstName,
            lastName: lastName,
            emailAddress: emailAddress
        });
        //call event
        EventSetIdentity(facebookId);
        //return
        return true;
    }

  //fallout functions
  function kill() checkOwner() {
    revert();
  }
}
