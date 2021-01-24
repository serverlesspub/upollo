import { AppSyncMockFile } from 'amplify-appsync-simulator'
import { VelocityTemplate } from 'amplify-appsync-simulator/lib/velocity'
import { readFileSync } from 'fs'
import { getAppSyncSimulator } from './get-appsync-simulator'

export function velocityInstance(filePath: string): VelocityTemplate {
  // Read the VTL file from the disc
  const vtl = readFileSync(filePath, 'utf8')
  const template: AppSyncMockFile = {
    content: vtl,
  }

  // Create a simulator instance
  const simulator = getAppSyncSimulator()
  // Create a VelocityTemplate instance
  return new VelocityTemplate(template, simulator)
}