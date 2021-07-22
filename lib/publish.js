const execa = require('execa')

module.exports = async (pluginConfig, { nextRelease: { version }, logger }) => {

  logger.log(`Building ${pluginConfig.name}`)

  try{
    await execa('docker', ['build', `${process.env.$DOCKER_BUILD_ARGS}`, '-t', `${pluginConfig.name}:latest`, '.'], { stdio: 'inherit' })
  } catch (err) {
    console.log('Docker image building failed')
    console.log(err);
  }

  logger.log(`Pushing version ${pluginConfig.name}:${version} to docker hub`)

  // Push both: new version and latest
  try{
    await execa('docker', ['tag', `${pluginConfig.name}:latest`, `${pluginConfig.name}:${version}`], { stdio: 'inherit' })
  } catch (err) {
    console.log(['tag', `${pluginConfig.name}:latest`, `${pluginConfig.name}:${version}`])
    console.log(err);
    throw new Error('docker tagging failed')
  }

  try{
    execa('docker', ['push', `${pluginConfig.name}:${version}`], { stdio: 'inherit' })
  } catch (err) {
    console.log(['push', `${pluginConfig.name}:${version}`]);
    console.log(err);
    throw new Error('docker push with version tag failed')
  }

  try{
    execa('docker', ['push', `${pluginConfig.name}:latest`], { stdio: 'inherit' })
  } catch (err) {
    console.log(['push', `${pluginConfig.name}:latest`]);
    console.log(err);
    throw new Error('docker push with latest tag failed')
  }

}
