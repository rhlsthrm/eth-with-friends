const SocialIdentityLinker = artifacts.require('./SocialIdentityLinker.sol')

module.exports = function (deployer) {
  deployer.deploy(SocialIdentityLinker, { gas: 5000000 })
}
