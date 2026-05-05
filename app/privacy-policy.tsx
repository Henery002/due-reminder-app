import { Stack } from 'expo-router';
import { LegalDocumentView } from '../src/components/LegalDocumentView';
import { getPrivacyPolicySections } from '../src/features/legal/legal.content';

export default function PrivacyPolicyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '隐私政策' }} />
      <LegalDocumentView
        description="当前草稿按本地优先、无账号、无云同步、无广告和无真实支付的原型状态编写。"
        eyebrow="Privacy Draft"
        sections={getPrivacyPolicySections()}
        title="隐私政策"
      />
    </>
  );
}
