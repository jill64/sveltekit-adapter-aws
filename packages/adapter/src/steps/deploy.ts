import { Context } from '../types/Context.js'
// import { exec } from '../util/exec.js'

export const deploy = async (context: Context) => {
  const { builder, options } = context
  const { deploy: deployStep } = options ?? {}

  // const run = async (command: string) => {
  //   const { stdout, stderr } = await exec(command)

  //   if (stderr) {
  //     builder.log.error(stderr)
  //   }

  //   if (stdout) {
  //     builder.log.minor(stdout)
  //   }
  // }

  if (deployStep) {
    builder.log.minor('Deploying...')

    // await run('cd ${} && (yes | npm exec cdk deploy)')

    return
  }

  if (deployStep === undefined) {
    builder.log.minor(`Option 'deploy' is not defined. Deploy step is skipped.`)
  }

  builder.log.minor('Generating CloudFormation Template...')

  // await run('cd ${} && (yes | npm exec cdk synth)')
}
