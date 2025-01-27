import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "../Styles/nodeStyle.css";

interface CustomNodeProps {
  data: {
    photo: string;
    name: string;
    surname: string;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div className="custom-node">
      <div className="custom-node-header">
        <div className="custom-node-photo">
          {/* {data.photo} */}
          <img
            decoding="async"
            src={`data:image/jpeg;base64,${data.photo}`}
            style={{
              maxWidth: "100%",
              maxHeight: "150px",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>
        <div className="custom-node-info">
          <div className="custom-node-name">{data.name}</div>
          <div className="custom-node-surname">{data.surname}</div>
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
