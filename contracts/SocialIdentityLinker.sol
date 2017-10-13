pragma solidity ^0.4.2;
import "./oraclizeAPI.sol";
import "./strings.sol";

contract SocialIdentityLinker is usingOraclize {
    using strings for *;
    //state variables
    address public owner;
    uint256 public totalIdentities ;
    mapping (uint256 => address) public facebookIdentity;

    modifier checkOwner() {require(owner == msg.sender); _ ;}

    //events
    event EventSetIdentity(uint256 facebookId);
    event newOraclizeQuery(string description);
    event Hello(string message);

    //constructor
    function SocialIdentityLinker() {
        owner = msg.sender;
        totalIdentities = 0;
        Hello("Hello, World!");
    }

    //core functions
    function __callback(bytes32 myid, string result) {
        if (msg.sender != oraclize_cbAddress()) throw;

        uint256 facebookId = parseInt(result);

        // set mapping entry at facebook ID to provided data
        // this operation can create new or overwrite previous data
        facebookIdentity[facebookId] =  msg.sender;

        //call event
        EventSetIdentity(facebookId);

        totalIdentities++;
    }

    function setIdentity(
        uint256 facebookId,
        string facebookAccessToken
    ) payable
    {
        var fbValidationURL = "json(https://graph.facebook.com/me?fields=id&access_token=".toSlice().concat(facebookAccessToken.toSlice());
        fbValidationURL = fbValidationURL.toSlice().concat(").id".toSlice());
        Hello(fbValidationURL);

        if (oraclize_getPrice("URL") > this.balance) {
            newOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            oraclize_query(60, "URL", fbValidationURL);
        }
    }

  //fallout functions
  function kill() checkOwner() {
    revert();
  }
}