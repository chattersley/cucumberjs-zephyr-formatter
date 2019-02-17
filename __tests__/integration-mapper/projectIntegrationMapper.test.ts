import * as fs from 'fs';
import JiraApi from 'jira-client';
import * as path from 'path';
import Project from '../../src/domain/Project';
import { projectIntegrationMapper } from '../../src/integration-mapper';

test('Check a full mapping from project JSON to domain model', () => {
    // Project setup
    const projectJira = JSON.parse(
        fs.readFileSync(
            path.resolve(__dirname, '../files/project.json'),
            'utf8'
        )
    ) as JiraApi.JsonResponse;

    // Run test
    const project = projectIntegrationMapper(projectJira) as Project;

    // Asserts
    expect(project.name).toBe('Cucumber');
    expect(project.key).toBe('CUC');
    expect(project.projectId).toBe(10000);
    expect(project.versions).not.toBeNull();
    expect(project.versions.length).toBe(1);

    project.versions.forEach(version => {
        expect(version.versionId).toBe(10000);
        expect(version.name).toBe('1.0.0');
    });
});
