import { App } from 'aws-cdk-lib';
import { defaultContext, GhaCdKPipeline } from '@cosmos/cdk-patterns';
import { applyCompliance } from '@cosmos/cdk-compliance';
import { AppStage } from '../lib/app-stage';
import { DplatEnvName } from '@cosmos/cdk-patterns/lib/utils';
import { appBuildCommands } from './buildCommands';

const app = new App({
  context: defaultContext,
});
applyCompliance(app);

const ghaCdkPipeline = new GhaCdKPipeline(app, 'GhaCdKPipeline', {
  synthCommands: ['yarn', ...appBuildCommands, 'npx cdk synth'],
});

ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.DEV), {
  gitHubEnvironment: 'Dev',
});

// Tst environment will soon be deprecated
ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.TST), {
  gitHubEnvironment: 'Tst',
});

ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.STUB), {
  gitHubEnvironment: 'Stub',
});

ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.SIT), {
  gitHubEnvironment: 'Sit',
});

ghaCdkPipeline.addStageWithGitHubOptions(new AppStage(app, DplatEnvName.PERF), {
  gitHubEnvironment: 'Perf',
});
