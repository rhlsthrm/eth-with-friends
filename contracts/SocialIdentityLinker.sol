pragma solidity ^0.4.2;
import "oraclize/usingOraclize.sol";
import "./strings.sol";

contract SocialIdentityLinker is usingOraclize {
    using strings for *;
    //state variables
    address public owner;
    uint256 public totalIdentities;

    struct requestStruct {
        address requestee;
        uint256 amount;
    }

    mapping (uint256 => address) public facebookIdentity;
    mapping (bytes32 => address) requestMap;
    
    //Keeps track of index of individual request
    mapping (address => uint256) public requestEthIndex;

    //Keeps track of requestee account address and owed amount
    mapping (address => requestStruct[]) public requestEthStruct;

    modifier checkOwner() {require(owner == msg.sender); _ ;}

    //events
    event EventSetIdentity(uint256 facebookId, address addr);
    event newOraclizeQuery(string description);
    event Hello(string message);

    //constructor
    function SocialIdentityLinker() public {
        owner = msg.sender;
        totalIdentities = 0;
        Hello("Hello, World!");
    }

    //core functions
    function __callback(bytes32 myid, string result) public {
        require(msg.sender == oraclize_cbAddress());
        require(requestMap[myid] != 0x0);

        uint256 facebookId = parseInt(result);

        // look up correct address from mapping
        // this operation can create new or overwrite previous data
        address sender = requestMap[myid];
        facebookIdentity[facebookId] = sender;
        delete requestMap[myid];

        //call event
        EventSetIdentity(facebookId, sender);

        totalIdentities++;
    }

    function requestEth(address _requestee,
                        uint _amount) public
    {
        //Account index increases by one before pushing struct to request mapping
        requestEthIndex[msg.sender]++;

        requestStruct s;
        s.requestee = _requestee;
        s.amount = _amount;

        requestEthStruct[msg.sender].push(s);
    }

    function payEth(address _requester, 
                        uint id) public payable
    {
        //Verify sent amount is the owed amount
        require (msg.value==requestEthStruct[_requester][id].amount);
        //Verify msg sender is the person who owed money
        require (msg.sender==requestEthStruct[_requester][id].requestee);

        _requester.transfer(msg.value);

        //Reset owed amount to 0, or should we just delete the entry?
        requestEthStruct[_requester][id].amount = 0;
    }

    function setIdentity(
        uint256 facebookId,
        string facebookAccessToken
    ) payable public
    {
        facebookIdentity[facebookId] = msg.sender;

        var fbValidationURL = "json(https://graph.facebook.com/me?fields=id&access_token=".toSlice().concat(facebookAccessToken.toSlice());
        fbValidationURL = fbValidationURL.toSlice().concat(").id".toSlice());
        Hello(fbValidationURL);

        if (oraclize_getPrice("URL") > this.balance) {
            newOraclizeQuery("Oraclize query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            newOraclizeQuery("Oraclize query was sent, standing by for the answer..");
            // map sender to query ID so we can look it up when the callback returns
            bytes32 queryId = oraclize_query(60, "URL", fbValidationURL);
            requestMap[queryId] = msg.sender;
        }
    }
}
