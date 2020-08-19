import React, { useMemo, useContext, useState } from 'react';
import { TMemo } from './TMemo';
import { useFormik } from 'formik';
import _isNil from 'lodash/isNil';
import _fromPairs from 'lodash/fromPairs';
import _isFunction from 'lodash/isFunction';

/**
 * 字段通用信息
 */
interface FastFormFieldCommon {
  name: string; // 字段名
  label?: string; // 字段标签
  [other: string]: any; // 其他字段
}

interface FastFormFieldProps extends FastFormFieldCommon {
  value: any;
  onChange: (val: any) => void; // 修改数据的回调函数
}

/**
 * 字段组件
 */
export type FastFormFieldComponent<T = {}> = React.ComponentType<
  FastFormFieldProps & T
>;

const fieldMap = new Map<string, FastFormFieldComponent>();
export function regField(type: string, component: FastFormFieldComponent<any>) {
  fieldMap.set(type, component);
}

/**
 * 容器配置
 */
export interface FastFormContainerProps {
  loading: boolean;
  submitLabel?: string;
  handleSubmit: () => void;
}
export type FastFormContainerComponent = React.ComponentType<
  FastFormContainerProps
>;
let FastFormContainer: FastFormContainerComponent;
export function regFormContainer(component: FastFormContainerComponent) {
  FastFormContainer = component;
}

/**
 * 字段配置
 */
export interface FastFormFieldMeta extends FastFormFieldCommon {
  type: string; // 字段类型
}
/**
 * 表单配置
 */
export interface FastFormProps {
  fields: FastFormFieldMeta[]; // 字段详情
  submitLabel?: string; // 提交按钮的标签名
  onSubmit: (values: any) => Promise<void> | void; // 点击提交按钮的回调
}

type FastFormContextType = ReturnType<typeof useFormik>;
const FastFormContext = React.createContext<FastFormContextType | null>(null);
FastFormContext.displayName = 'FastFormContext';

export function useFastFormContext(): FastFormContextType | null {
  return useContext(FastFormContext);
}

/**
 * 一个快速生成表单的组件
 * 用于通过配置来生成表单，简化通用代码
 */
export const FastForm: React.FC<FastFormProps> = TMemo((props) => {
  const initialValues = useMemo(() => {
    return _fromPairs(props.fields.map((field) => [field.name, '']));
  }, [props.fields]);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        _isFunction(props.onSubmit) && (await props.onSubmit(values));
      } finally {
        setLoading(false);
      }
    },
  });
  const { handleSubmit, setFieldValue, values } = formik;

  if (_isNil(FastFormContainer)) {
    console.warn('FastFormContainer 没有被注册');
    return null;
  }

  const fieldsRender = useMemo(() => {
    return props.fields.map((fieldMeta) => {
      const fieldName = fieldMeta.name;
      const Component = fieldMap.get(fieldMeta.type);

      if (_isNil(Component)) {
        return null;
      } else {
        return (
          <Component
            {...fieldMeta}
            value={values[fieldName]}
            onChange={(val) => setFieldValue(fieldName, val)}
          />
        );
      }
    });
  }, [props.fields, values, setFieldValue]);

  return (
    <FastFormContext.Provider value={formik}>
      <FastFormContainer
        loading={loading}
        submitLabel={props.submitLabel}
        handleSubmit={handleSubmit}
      >
        {fieldsRender}
      </FastFormContainer>
    </FastFormContext.Provider>
  );
});
FastForm.displayName = 'FastForm';
FastForm.defaultProps = {
  submitLabel: '提交',
};
