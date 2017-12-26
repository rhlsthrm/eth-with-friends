pragma solidity ^0.4.2;
import "oraclize/usingOraclize.sol";
import "./strings.sol";

contract SocialIdentityLinker is usingOraclize {
    using strings for *;
    //state variables
    address public owner;
    uint256 public totalIdentities;

    struct _struct {
        address _address;
        uint256 _amount;
        string _description;
    }

    mapping (uint256 => address) public facebookIdentity;
    mapping (bytes32 => address) requestMap;
    
    //Keeps track of index of individual request
    mapping (address => uint256) public requestEthIndex;

    //Keeps track of requestee account address and owed amount
    mapping (address => _struct[]) public requestEthStruct;

    //Keeps track of index of individual request havne't yet to be paid
    mapping (address => uint256) public payEthIndex;

    //Keeps track of requster account address and owed amount
    mapping (address => _struct[]) public payEthStruct;

    modifier checkOwner() {require(owner == msg.sender); _ ;}

    //events
    event EventSetIdentity(uint256 facebookId, address addr);
    event newOraclizeQuery(string description);
    event Hello(string message);

    //constructor
    function SocialIdentityLinker() public {
        owner = msg.sender;
        OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
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
                        uint _amount,
                        string _description) public
    {

        _struct s;
        s._address = _requestee;
        s._amount = _amount;
        s._description = _description;

        requestEthStruct[msg.sender].push(s);

        s._address = msg.sender;
        payEthStruct[_requestee].push(s);

        //Increase both indexes by one
        requestEthIndex[msg.sender]++;
        payEthIndex[_requestee]++;
    }

    function payEth(uint id) 
    public payable 
    {
        address payTo = payEthStruct[msg.sender][id]._address;
        //Verify transaction amount is whole
        require (payEthStruct[msg.sender][id]._amount==msg.value);
        //Verify transaction sender is correct
        require (requestEthStruct[payTo][id]._address==msg.sender);


        payTo.transfer(msg.value);

        //Reset amount to 0
        requestEthStruct[payTo][id]._amount = 0;
        payEthStruct[msg.sender][id]._amount = 0;
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
