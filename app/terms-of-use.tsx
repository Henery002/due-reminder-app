import { Stack } from 'expo-router';
import { LegalDocumentView } from '../src/components/LegalDocumentView';
import { getTermsOfUseSections } from '../src/features/legal/legal.content';

export default function TermsOfUseScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '用户协议' }} />
      <LegalDocumentView
        description="这里先明确原型阶段的服务边界，避免把辅助提醒误认为正式通知或担保。"
        eyebrow="Terms Draft"
        sections={getTermsOfUseSections()}
        title="用户协议"
      />
    </>
  );
}
