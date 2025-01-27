import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Menu from "../views/Menu";
import LoginPage from "../views/LoginPage";
import Register from "../components/Forms/Register";
import PrivacyPolicy from "../views/PrivacyPolicy";
import SettingsPage from "../views/SettingsPage";
import ChoiceOfActionPage from "../views/ChoiceOfActionPage";
import AddRelationForm from "../components/Forms/AddRelationForm";
import OpenTree from "../views/OpenTree";
import TreeView from "../views/TreeView";
import TreeViewEdition from "../views/TreeViewEdition";
import RelationList from "../components/RelationList_forTest";
import NotFound from "../components/NotFound";


export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Menu /> },
      { path: "menu", element: <Menu /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <Register /> },
      { path: "privacyPolicy", element: <PrivacyPolicy /> },
      { path: "settingsPage", element: <SettingsPage /> },
      { path: "choiceOfActionPage", element: <ChoiceOfActionPage /> },

      { path: "openTree", element: <OpenTree /> },
      { path: "treeView", element: <TreeView /> },
      { path: "treeViewEdition/:familyTreeId", element: <TreeViewEdition /> },
      { path: "treeView/:familyTreeId", element: <TreeView /> },

      {
        path: "treeViewEdition/:familyTreeId/:id",
        element: <TreeViewEdition />,
      },
      { path: "*", element: <NotFound /> },

      {
        path: "relationList/:familyTreeId/:personId",
        element: <RelationList />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
