import { spawn } from 'child_process'
import { Context } from '../types/Context.js'

export const deploy = async ({
  builder,
  options: { deploy: deployStep, out, skipBootstrap }
}: Context) => {
  const run = (cmd: string) =>
    new Promise<void>((resolve, reject) => {
      const res = spawn(cmd, {
        shell: true,
        cwd: out
      })

      res.stdout.on('data', (data) => builder.log(data.toString()))
      res.stderr.on('data', (data) => builder.log(data.toString()))

      res.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command '${cmd}' exited with code ${code}`))
        } else {
          resolve()
        }
      })
    })

  if (deployStep) {
    if (!skipBootstrap) {
      await run('npx cdk bootstrap')
    }

    builder.log.minor('Deploying...')

    await run('npx cdk deploy --require-approval never --all')

    return
  }

  if (deployStep === undefined) {
    builder.log.minor(`Option 'deploy' is not defined. Deploy step is skipped.`)
  }

  builder.log.minor('Generating CloudFormation Template...')

  await run('npx cdk synth')
}
