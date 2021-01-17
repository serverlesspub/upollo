#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { AppsyncStack } from '../lib/appsync-stack';

const app = new cdk.App();
new AppsyncStack(app, 'AppsyncStack');
