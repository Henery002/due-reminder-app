import { Stack } from 'expo-router';
import { LegalDocumentView } from '../src/components/LegalDocumentView';
import { getPermissionGuideSections } from '../src/features/legal/legal.content';

export default function PermissionsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '权限说明' }} />
      <LegalDocumentView
        description="当前版本只围绕本地提醒解释权限，不额外申请与提醒无关的敏感权限。"
        eyebrow="Permission Guide"
        sections={getPermissionGuideSections()}
        title="权限说明"
      />
    </>
  );
}
