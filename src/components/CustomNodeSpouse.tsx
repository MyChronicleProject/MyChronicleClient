import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "../Styles/nodeStyleSpouse.css";

interface CustomNodeProps {
  data: {
    name: string;
    date: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div className="custom-node2">
      <div className="custom-node-header">
        <div className="custom-node-info">
          <div className="custom-node-name">{data.name}</div>
          <div className="custom-node-surname">{data.date}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="handle handle-target"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="handle handle-source"
      />
    </div>
  );
};

export default memo(CustomNode);
