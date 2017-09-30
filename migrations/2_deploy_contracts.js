const SimpleStorage = artifacts.require('./SimpleStorage.sol')
const SocialIdentityLinker = artifacts.require('./SocialIdentityLinker.sol')

module.exports = function (deployer) {
  deployer.deploy(SimpleStorage)
  deployer.deploy(SocialIdentityLinker)
}
