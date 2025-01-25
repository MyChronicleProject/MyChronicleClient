import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Menu from "../Component/Menu";
import LoginPage from "../Component/LoginPage";
import Register from "../Component/Forms/Register";
import PrivacyPolicy from "../Component/PrivacyPolicy";
import SettingsPage from "../Component/SettingsPage";
import ChoiceOfActionPage from "../Component/ChoiceOfActionPage";
import AddRelationForm from "../Component/Forms/AddRelationForm";
import OpenTree from "../Component/OpenTree";
import TreeView from "../Component/TreeView";
import TreeViewEdition from "../Component/TreeViewEdition";
import RelationList from "../Component/RelationList_forTest";
import NotFound from "../Component/NotFound";


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
