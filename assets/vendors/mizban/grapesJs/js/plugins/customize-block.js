import { confCols } from '../../../commands/variables.js';

const colsCount = confCols.count;
function flexColBlock(editor) {
    editor.Blocks.add('modal-block', {
        label: '<i class="fa-solid fa-grip-lines-vertical"></i><span>col</span>',
        content: '<div class="modal-block"></div>',
        category: 'layouts_category',
        activate: true,
    });

    editor.on('block:drag:stop', (blockModel) => {
        if (blockModel.view.el.getAttribute('class').includes("modal-block")) {
            openModal(blockModel);
        }
    });

    function openModal(blockModel) {
        const modal = editor.Modal;
        modal.setTitle(`Enter a number between 1 and ${colsCount}`);
        modal.setContent(`
        <div>
            <h4>Enter the number of cells:</h4>
            <input id="cell-input" type="number" min="1" max="${colsCount}" value="1" style="width: 100%; padding: 5px;">
            <button id="create-cells" style="margin-top: 10px; padding: 10px;">Create Cells</button>
        </div>
        `);
        modal.open();

        document.getElementById('create-cells').addEventListener('click', () => {
            const numCells = parseInt(document.getElementById('cell-input').value);

            if (numCells >= 1 && numCells <= colsCount) {
                createCells(blockModel, numCells);
                modal.close();
            } else {
                alert(`Please enter a number between 1 and ${colsCount}`);
            }
        });
    }

    function createCells(blockModel, num) {
        const components = {
            type: 'miz col',
            classes: ['d-flex', 'miz-col'],
            components: []
        };

        for (let i = 0; i < num; i++) {
            components.components.push({
                tagName:'div',
                type: 'miz cell',
                classes: ['cell'],
            });
        }

        const modalBlock = blockModel.view.el;
        const modalComponent = editor.getWrapper().find(`#${modalBlock.id}`)[0];

        modalComponent.append(components);
    }
}

export { flexColBlock };
