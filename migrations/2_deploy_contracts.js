const usingOraclize = artifacts.require("oraclize/usingOraclize.sol");
const SocialIdentityLinker = artifacts.require('./SocialIdentityLinker.sol')

module.exports = function (deployer) {
  deployer.deploy(usingOraclize).then(()=>{
    return deployer.deploy(SocialIdentityLinker, usingOraclize.address)
  })
}