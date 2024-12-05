import AddPersonForm from './AddPersonForm';
import Tree from './Tree';
import AppBar from './AppBar';
import BottomBar from './BottomBar';

export default function TreeViewEdition() {
    return (
        <div >
        <AppBar/>
        <div className='App4'>
            <div className="left-panel">
                <h1>Drzewo</h1>
                <Tree />
            </div>
            <div className="right-panel">
                <AddPersonForm />
            </div>

        </div>
        <BottomBar/>
        </div>
    
    );
}




