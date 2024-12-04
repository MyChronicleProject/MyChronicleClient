import Tree from './Tree';
import AppBar from './AppBar';
import BottomBar from './BottomBar';

export default function TreeView() {
    return (
        <div >
            <AppBar/>
        <div className='App4'>
        <div className="left-panel">
            <h1>Drzewo</h1>
            <Tree />
        </div></div>
        <BottomBar/>
        </div>
    );
    
}