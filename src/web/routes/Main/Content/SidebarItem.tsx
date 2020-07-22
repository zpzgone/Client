import React from 'react';
import { TMemo } from '@shared/components/TMemo';
import styled from 'styled-components';
import { Avatar } from '@web/components/Avatar';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 42px;
  padding: 0 8px;

  &:hover {
    background-color: ${(props) => props.theme.color.transparent90};
  }
`;

interface SidebarItemProps {
  icon: string | React.ReactElement;
  name: string;
}
export const SidebarItem: React.FC<SidebarItemProps> = TMemo((props) => {
  const { icon, name } = props;

  return (
    <Container>
      <div style={{ marginRight: 8 }}>
        {React.isValidElement(icon) ? icon : <Avatar src={icon} name={name} />}
      </div>

      <span>{name}</span>
    </Container>
  );
});
SidebarItem.displayName = 'SidebarItem';