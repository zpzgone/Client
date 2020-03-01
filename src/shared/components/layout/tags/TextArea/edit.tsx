import React, { useCallback, useMemo } from 'react';
import { TagComponent } from '../type';
import TextArea, { AutoSizeType } from 'antd/lib/input/TextArea';
import { TagInputProps } from '../Input/shared';
import { useLayoutFormData } from '../../hooks/useLayoutFormData';
import { useLayoutFormContainer } from '../../hooks/useLayoutFormContainer';
import { TMemo } from '@shared/components/TMemo';

interface TagProps extends TagInputProps {
  autosize: boolean | AutoSizeType;
}
export const TagTextAreaEdit: TagComponent<TagProps> = TMemo((props) => {
  const { label, placeholder, stateValue, setStateValue } = useLayoutFormData(
    props
  );

  const autosize = useMemo(() => props.autosize, []); // autosize 只在最初获取一次。不会接受后续的动态变更

  const FormContainer = useLayoutFormContainer(props);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;

      setStateValue(value);
    },
    []
  );

  return useMemo(
    () => (
      <FormContainer label={label}>
        <TextArea
          autosize={autosize}
          placeholder={placeholder}
          value={stateValue}
          onChange={handleChange}
        />
      </FormContainer>
    ),
    [label, autosize, placeholder, stateValue, handleChange]
  );
});
TagTextAreaEdit.displayName = 'TagTextAreaEdit';