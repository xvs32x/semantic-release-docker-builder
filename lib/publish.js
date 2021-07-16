const execa = require('execa')

module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {
  logger.log(`Pushing version ${pluginConfig.name}:${version} to docker hub`)

  // Push both new version and latest
  try{
    await execa('docker', ['tag', `${pluginConfig.name}:latest`, `${pluginConfig.name}:${version}`], { stdio: 'inherit' })
  } catch (err) {
    throw new Error('docker tagging failed')
  }

  try{
    execa('docker', ['push', `${pluginConfig.name}:${version}`], { stdio: 'inherit' })
  } catch (err) {
    throw new Error('docker push with version tag failed')
  }

  try{
    execa('docker', ['push', `${pluginConfig.name}:latest`], { stdio: 'inherit' })
  } catch (err) {
    throw new Error('docker push with latest tag failed')
  }

}
