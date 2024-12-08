import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../App";
import Menu from "../Component/Menu";
import LoginPage from "../Component/LoginPage";
import Register from "../Component/Register";
import PrivacyPolicy from "../Component/PrivacyPolicy";
import SettingsPage from "../Component/SettingsPage";
import ChoiceOfActionPage from "../Component/ChoiceOfActionPage";
import AddRelation from "../Component/AddRelation";
import AddRelationForm from "../Component/AddRelationForm";
import OpenTree from "../Component/OpenTree";
import TreeView from "../Component/TreeView";
import TreeViewEdition from "../Component/TreeViewEdition";
import Tree from "../Component/Tree";
import RelationList from "../Component/RelationList_forTest";

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
      { path: "addRelation/:familyTreeId/:personId", element: <AddRelation /> },
      {
        path: "addRelation/:familyTreeId/:personId/:id",
        element: <AddRelation />,
      },
      { path: "openTree", element: <OpenTree /> },
      { path: "treeView", element: <TreeView /> },
      { path: "treeViewEdition/:familyTreeId", element: <TreeViewEdition /> },
      {
        path: "treeViewEdition/:familyTreeId/:id",
        element: <TreeViewEdition />,
      },
      { path: "*", element: <Navigate replace to="/not-found" /> },
      { path: "addRelationForm", element: <AddRelationForm /> },
      {
        path: "relationList/:familyTreeId/:personId",
        element: <RelationList />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
