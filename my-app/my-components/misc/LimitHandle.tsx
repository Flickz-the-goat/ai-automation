import React from 'react';
import { Handle, useNodeConnections, type HandleProps } from '@xyflow/react';

interface CustomHandleProps extends HandleProps {
  connectionCount: number;
}

export default function LimitHandle(props: CustomHandleProps){
  const { type, connectionCount, ...restProps } = props;

  const connections = useNodeConnections({
    handleType: type,
  });

  return (
    <Handle
      {...restProps}
      type={type}
      isConnectable={connections.length < connectionCount}
    />
  );
};

