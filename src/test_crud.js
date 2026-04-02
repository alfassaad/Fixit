// This file is for testing CRUD operations for issues.

import { createIssue, getIssueById, updateIssue, deleteIssue } from './services/issueService.js';

// Test data
const testIssue = {
  title: 'Test Issue',
  description: 'This is a test issue.',
  category: 'Roads & Potholes',
  address: '123 Test St',
  latitude: 34.0522,
  longitude: -118.2437,
  priority: 'low',
};

async function runTests() {
  let newIssueId;

  try {
    // 1. Test: Create Issue
    console.log('Running test: CREATE issue...');
    const newIssue = await createIssue(testIssue);
    newIssueId = newIssue.id;
    console.log(`  -> Success: Created issue with ID: ${newIssueId}`);

    // 2. Test: Read Issue
    console.log('Running test: READ issue...');
    const fetchedIssue = await getIssueById(newIssueId);
    console.log('  -> Success: Fetched issue:', fetchedIssue);

    // 3. Test: Update Issue
    console.log('Running test: UPDATE issue...');
    const updatedIssue = await updateIssue(newIssueId, { status: 'in_progress', priority: 'medium' });
    console.log('  -> Success: Updated issue:', updatedIssue);

    // 4. Test: Delete Issue
    console.log('Running test: DELETE issue...');
    await deleteIssue(newIssueId);
    console.log('  -> Success: Deleted issue.');

    // 5. Verify Deletion
    console.log('Verifying deletion...');
    try {
      await getIssueById(newIssueId);
      console.error('  -> Error: Issue was not deleted.');
    } catch (error) {
      console.log('  -> Success: Issue not found, deletion confirmed.');
    }

  } catch (error) {
    console.error('A test failed:', error);
    // Clean up if an issue was created but not deleted
    if (newIssueId) {
      console.log(`Cleaning up created issue (ID: ${newIssueId})...`);
      try {
        await deleteIssue(newIssueId);
        console.log('Cleanup successful.');
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }
  }
}

// Run the tests
runTests();
