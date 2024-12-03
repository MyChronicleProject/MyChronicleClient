import AddPersonForm from './AddPersonForm';
import Tree from './Tree';

export default function TreeViewEdition() {
    return (
        <div>
            <div className="left-panel">
                <h1>Drzewo</h1>
                <Tree />
            </div>
            <div className="right-panel">
                <AddPersonForm />
            </div>

        </div>
    )
}




