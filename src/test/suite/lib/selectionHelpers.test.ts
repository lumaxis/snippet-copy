import * as assert from 'assert';
import { Selection } from 'vscode';
import { lineIndexesForSelection } from '../../../lib/selectionHelpers';


describe('Selection Helpers', function () {
	context('calculateSelectionLineIndexes', () => {
		it('calculates the correct line indexes from an empty selection', () => {
			assert.deepEqual([0], lineIndexesForSelection(new Selection(0, 0, 0, 0)));
		});

		it('calculates the correct line indexes from a single line selection', () => {
			assert.deepEqual([1], lineIndexesForSelection(new Selection(1, 2, 1, 15)));
		});

		it('calculates the correct line indexes from a multiline selection', () => {
			assert.deepEqual([1, 2, 3], lineIndexesForSelection(new Selection(1, 2, 3, 3)));
		});

		it('calculates the correct line indexes from an reversed selection ', () => {
			assert.deepEqual([1, 2, 3], lineIndexesForSelection(new Selection(3, 0, 1, 0)));
		});
	});
});
