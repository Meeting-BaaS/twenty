import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk';

type RecordingPreference = 'RECORD_ALL' | 'RECORD_ORGANIZED' | 'RECORD_NONE';

type WorkspaceMember = {
  id: string;
  recordingPreference?: RecordingPreference;
  botName?: string;
  botEntryMessage?: string;
};

type CalendarChannel = {
  id: string;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledHeading = styled.h2`
  color: #1f2937;
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const StyledSectionDescription = styled.p`
  color: #6b7280;
  font-family: Inter, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
`;

const StyledCard = styled.div`
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  padding: 16px;
`;

const StyledIconContainer = styled.div`
  align-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  color: #4b5563;
  display: flex;
  flex-shrink: 0;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StyledTitle = styled.span`
  color: #1f2937;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
`;

const StyledDescription = styled.span`
  color: #6b7280;
  font-family: Inter, sans-serif;
  font-size: 13px;
`;

const StyledStatus = styled.span<{ tone: 'green' | 'red' }>`
  align-items: center;
  background: ${({ tone }) => (tone === 'green' ? '#dcfce7' : '#fee2e2')};
  border-radius: 999px;
  color: ${({ tone }) => (tone === 'green' ? '#166534' : '#991b1b')};
  display: inline-flex;
  flex-shrink: 0;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  height: 28px;
  padding: 0 10px;
  white-space: nowrap;
`;

const StyledRadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledRadioLabel = styled.label<{ selected: boolean }>`
  align-items: center;
  background: ${({ selected }) =>
    selected ? '#eff6ff' : '#ffffff'};
  border: 1px solid
    ${({ selected }) =>
      selected ? '#2563eb' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #2563eb;
  }
`;

const StyledRadioInput = styled.input`
  accent-color: #2563eb;
  cursor: pointer;
  height: 16px;
  margin: 0;
  width: 16px;
`;

const StyledRadioTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledRadioTitle = styled.span`
  color: #1f2937;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 600;
`;

const StyledRadioDescription = styled.span`
  color: #6b7280;
  font-family: Inter, sans-serif;
  font-size: 12px;
`;

const StyledFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StyledFieldLabel = styled.label`
  color: #1f2937;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

const StyledTextInput = styled.input`
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #111827;
  font-family: Inter, sans-serif;
  font-size: 14px;
  margin-top: 4px;
  outline: none;
  padding: 10px 12px;
  width: 100%;

  &:focus {
    border-color: #2563eb;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const StyledCharCount = styled.span<{ over: boolean }>`
  color: ${({ over }) => (over ? '#dc2626' : '#6b7280')};
  font-family: Inter, sans-serif;
  font-size: 11px;
  margin-top: 2px;
  text-align: right;
`;

const StyledCallout = styled.div<{ variant: 'warning' | 'info' }>`
  background: ${({ variant }) => (variant === 'warning' ? '#fffbeb' : '#eff6ff')};
  border: 1px solid ${({ variant }) => (variant === 'warning' ? '#fcd34d' : '#93c5fd')};
  border-radius: 8px;
  color: #1f2937;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
`;

const StyledCalloutTitle = styled.span`
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

const StyledCalloutDescription = styled.span`
  color: #4b5563;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 1.5;
`;

const PREFERENCE_OPTIONS: Array<{
  value: RecordingPreference;
  title: string;
  description: string;
}> = [
  {
    value: 'RECORD_ALL',
    title: 'Record all meetings',
    description: 'Automatically record every meeting with a conference link',
  },
  {
    value: 'RECORD_ORGANIZED',
    title: 'Organizer only',
    description: 'Only record meetings you organized',
  },
  {
    value: 'RECORD_NONE',
    title: 'Do not record',
    description: 'No automatic recording — you can still record manually',
  },
];

const fetchCurrentWorkspaceMember = async (): Promise<WorkspaceMember> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/currentWorkspaceMember`, {
    headers: { Authorization: `Bearer ${process.env.TWENTY_API_KEY}` },
  });
  const data = await response.json();
  return data?.data ?? data;
};

const updateWorkspaceMember = async (
  memberId: string,
  fields: {
    recordingPreference?: RecordingPreference;
    botName?: string | null;
    botEntryMessage?: string | null;
  },
): Promise<void> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/workspaceMembers/${memberId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.TWENTY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  });
  if (!response.ok) {
    throw new Error(`PATCH failed: ${response.status}`);
  }
};

const fetchCalendarChannels = async (): Promise<CalendarChannel[]> => {
  const response = await fetch(`${process.env.TWENTY_API_URL}/rest/calendarChannels?limit=1`, {
    headers: { Authorization: `Bearer ${process.env.TWENTY_API_KEY}` },
  });
  const data = await response.json();
  return data?.data?.calendarChannels ?? [];
};

const MeetingBaasSettings = () => {
  const [member, setMember] = useState<WorkspaceMember | null>(null);
  const [preference, setPreference] = useState<RecordingPreference>('RECORD_NONE');
  const [botName, setBotName] = useState('');
  const [botEntryMessage, setBotEntryMessage] = useState('');
  const [hasCalendar, setHasCalendar] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const apiKeyConfigured = Boolean(process.env.MEETING_BAAS_API_KEY);

  useEffect(() => {
    Promise.all([fetchCurrentWorkspaceMember(), fetchCalendarChannels()])
      .then(([memberData, channels]) => {
        setMember(memberData);
        setPreference(memberData.recordingPreference ?? 'RECORD_NONE');
        setBotName(memberData.botName ?? '');
        setBotEntryMessage(memberData.botEntryMessage ?? '');
        setHasCalendar(channels.length > 0);
      })
      .catch(() => {
        // Non-fatal: show defaults
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handlePreferenceChange = async (newPreference: RecordingPreference) => {
    if (!member || isSaving) return;
    const previousPreference = preference;
    setIsSaving(true);
    setPreference(newPreference);
    try {
      await updateWorkspaceMember(member.id, { recordingPreference: newPreference });
      setMember({ ...member, recordingPreference: newPreference });
    } catch {
      setPreference(previousPreference);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBotNameBlur = async () => {
    if (!member || isSaving) return;
    const trimmed = botName.trim();
    if (trimmed === (member.botName ?? '')) return;
    setIsSaving(true);
    try {
      await updateWorkspaceMember(member.id, { botName: trimmed || null });
      setMember({ ...member, botName: trimmed || undefined });
    } catch {
      setBotName(member.botName ?? '');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEntryMessageBlur = async () => {
    if (!member || isSaving) return;
    const trimmed = botEntryMessage.trim().slice(0, 500);
    if (trimmed === (member.botEntryMessage ?? '')) return;
    setIsSaving(true);
    try {
      await updateWorkspaceMember(member.id, { botEntryMessage: trimmed || null });
      setMember({ ...member, botEntryMessage: trimmed || undefined });
    } catch {
      setBotEntryMessage(member.botEntryMessage ?? '');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <StyledSection>
          <StyledHeading>Meeting Recording</StyledHeading>
          <StyledSectionDescription>Loading settings...</StyledSectionDescription>
        </StyledSection>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      {/* API Key Status */}
      <StyledSection>
        <div>
          <StyledHeading>Meeting BaaS Connection</StyledHeading>
          <StyledSectionDescription>
            Meeting BaaS records your meetings and syncs transcripts into Twenty
          </StyledSectionDescription>
        </div>
        <StyledCard>
          <StyledIconContainer>
            <span style={{ fontSize: 20 }}>🎥</span>
          </StyledIconContainer>
          <StyledTextContainer>
            <StyledTitle>API Key</StyledTitle>
            <StyledDescription>
              {apiKeyConfigured
                ? 'Your Meeting BaaS API key is configured'
                : 'No API key configured — add MEETING_BAAS_API_KEY in app variables'}
            </StyledDescription>
          </StyledTextContainer>
          <StyledStatus tone={apiKeyConfigured ? 'green' : 'red'}>
            {apiKeyConfigured ? 'Connected' : 'Not Set'}
          </StyledStatus>
        </StyledCard>
      </StyledSection>

      {/* Calendar Connection Banner */}
      {hasCalendar === false && (
        <StyledCallout variant="warning">
          <StyledCalloutTitle>No calendar connected</StyledCalloutTitle>
          <StyledCalloutDescription>
            Connect your Google or Microsoft calendar in Settings {'->'} Accounts to enable
            automatic meeting recording.
          </StyledCalloutDescription>
        </StyledCallout>
      )}

      {/* Recording Preference */}
      <StyledSection>
        <div>
          <StyledHeading>Recording Preference</StyledHeading>
          <StyledSectionDescription>
            Choose which meetings are automatically recorded when they have a conference
            link
          </StyledSectionDescription>
        </div>
        <StyledRadioGroup>
          {PREFERENCE_OPTIONS.map((option) => (
            <StyledRadioLabel key={option.value} selected={preference === option.value}>
              <StyledRadioInput
                type="radio"
                name="recordingPreference"
                value={option.value}
                checked={preference === option.value}
                onChange={() => handlePreferenceChange(option.value)}
                disabled={isSaving}
              />
              <StyledRadioTextContainer>
                <StyledRadioTitle>{option.title}</StyledRadioTitle>
                <StyledRadioDescription>{option.description}</StyledRadioDescription>
              </StyledRadioTextContainer>
            </StyledRadioLabel>
          ))}
        </StyledRadioGroup>
      </StyledSection>

      {/* Bot Customization */}
      <StyledSection>
        <div>
          <StyledHeading>Bot Customization</StyledHeading>
          <StyledSectionDescription>
            Customize how the recording bot appears when it joins your meetings
          </StyledSectionDescription>
        </div>
        <StyledFieldGroup>
          <div>
            <StyledFieldLabel>Bot name</StyledFieldLabel>
            <StyledTextInput
              type="text"
              placeholder="Twenty CRM Recorder"
              value={botName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBotName(e.target.value)}
              onBlur={handleBotNameBlur}
              disabled={isSaving}
            />
          </div>
          <div>
            <StyledFieldLabel>Entry message</StyledFieldLabel>
            <StyledTextInput
              type="text"
              placeholder="Message posted in chat when the bot joins"
              value={botEntryMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setBotEntryMessage(e.target.value.slice(0, 500))
              }
              onBlur={handleEntryMessageBlur}
              disabled={isSaving}
              maxLength={500}
            />
            <StyledCharCount over={botEntryMessage.length >= 500}>
              {botEntryMessage.length}/500
            </StyledCharCount>
          </div>
        </StyledFieldGroup>
      </StyledSection>

      {preference !== 'RECORD_NONE' && !apiKeyConfigured && (
        <StyledCallout variant="info">
          <StyledCalloutTitle>API key required</StyledCalloutTitle>
          <StyledCalloutDescription>
            Recording is enabled but no API key is set. Add `MEETING_BAAS_API_KEY` in
            the app variables to start recording.
          </StyledCalloutDescription>
        </StyledCallout>
      )}
    </StyledContainer>
  );
};

export const SETTINGS_FRONT_COMPONENT_ID = '7f2c17b4-2cd2-5447-b7d1-83ef12040837';

export default defineFrontComponent({
  universalIdentifier: SETTINGS_FRONT_COMPONENT_ID,
  name: 'meeting-baas-settings',
  description: 'Settings panel for Meeting BaaS recording preferences and connection status',
  component: MeetingBaasSettings,
});
