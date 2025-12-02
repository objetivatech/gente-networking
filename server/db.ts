import { supabase, supabaseAdmin } from "./supabase.js";

// ============================================
// TYPES
// ============================================

export type User = {
  id: number;
  open_id: string;
  name: string | null;
  email: string | null;
  login_method: string | null;
  role: 'admin' | 'facilitator' | 'member' | 'guest';
  created_at: string;
  updated_at: string;
  last_signed_in: string;
};

export type Profile = {
  id: number;
  user_id: number;
  phone: string | null;
  company: string | null;
  position: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  bio: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: number;
  user_id: number;
  type: 'referral' | 'business' | 'meeting' | 'testimonial';
  title: string | null;
  description: string;
  to_user_id: number | null;
  value: number | null;
  points: number;
  activity_date: string;
  created_at: string;
};

export type Score = {
  id: number;
  user_id: number;
  month: number;
  year: number;
  total_points: number;
  referral_count: number;
  business_count: number;
  meeting_count: number;
  testimonial_count: number;
  total_business_value: number;
  created_at: string;
  updated_at: string;
};

export type Meeting = {
  id: number;
  group_id: number | null;
  title: string;
  description: string | null;
  meeting_date: string;
  location: string | null;
  is_completed: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type Guest = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  invited_by: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Content = {
  id: number;
  title: string;
  description: string | null;
  type: 'video' | 'document' | 'presentation' | 'link';
  url: string;
  category: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
};

// ============================================
// USER FUNCTIONS
// ============================================

export async function upsertUser(user: {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: 'admin' | 'facilitator' | 'member' | 'guest';
  lastSignedIn?: Date;
}): Promise<void> {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('open_id', user.openId)
    .single();

  if (existingUser) {
    // Update existing user
    await supabaseAdmin
      .from('users')
      .update({
        name: user.name,
        email: user.email,
        login_method: user.loginMethod,
        role: user.role,
        last_signed_in: user.lastSignedIn?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('open_id', user.openId);
  } else {
    // Insert new user
    await supabaseAdmin
      .from('users')
      .insert({
        open_id: user.openId,
        name: user.name,
        email: user.email,
        login_method: user.loginMethod,
        role: user.role || 'member',
        last_signed_in: user.lastSignedIn?.toISOString() || new Date().toISOString(),
      });
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('open_id', openId)
    .single();

  if (error || !data) return undefined;
  return data as User;
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return (data as User[]) || [];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return data as User;
}

// ============================================
// PROFILE FUNCTIONS
// ============================================

export async function getProfileByUserId(userId: number): Promise<Profile | undefined> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return undefined;
  return data as Profile;
}

export async function upsertProfile(profile: {
  userId: number;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
}): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('user_id', profile.userId)
    .single();

  const profileData = {
    user_id: profile.userId,
    phone: profile.phone,
    company: profile.company,
    position: profile.position,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zip_code: profile.zipCode,
    bio: profile.bio,
    avatar_url: profile.avatarUrl,
    linkedin_url: profile.linkedinUrl,
    facebook_url: profile.facebookUrl,
    instagram_url: profile.instagramUrl,
    website_url: profile.websiteUrl,
  };

  if (existing) {
    await supabaseAdmin
      .from('profiles')
      .update(profileData)
      .eq('user_id', profile.userId);
  } else {
    await supabaseAdmin
      .from('profiles')
      .insert(profileData);
  }
}

// ============================================
// GROUP FUNCTIONS
// ============================================

export async function getAllGroups(): Promise<Group[]> {
  const { data, error } = await supabaseAdmin
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw new Error(error.message);
  return (data as Group[]) || [];
}

export async function getGroupById(id: number): Promise<Group | undefined> {
  const { data, error } = await supabaseAdmin
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return data as Group;
}

export async function createGroup(group: {
  name: string;
  description?: string;
}): Promise<void> {
  await supabaseAdmin
    .from('groups')
    .insert(group);
}

export async function getGroupMembers(groupId: number): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('group_members')
    .select(`
      id,
      joined_at,
      is_facilitator,
      users!group_members_user_id_fkey (
        id,
        name,
        email,
        role
      )
    `)
    .eq('group_id', groupId);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addMemberToGroup(groupId: number, userId: number): Promise<void> {
  await supabaseAdmin
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: userId,
      is_facilitator: false,
    });
}

export async function removeMemberFromGroup(groupId: number, userId: number): Promise<void> {
  await supabaseAdmin
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);
}

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

export async function createActivity(activity: {
  fromUserId: number;
  type: 'referral' | 'business' | 'meeting' | 'testimonial';
  title?: string;
  description: string;
  toUserId?: number;
  value?: number;
  points: number;
  activityDate: Date;
}): Promise<void> {
  await supabaseAdmin
    .from('activities')
    .insert({
      user_id: activity.fromUserId,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      to_user_id: activity.toUserId,
      value: activity.value,
      points: activity.points,
      activity_date: activity.activityDate.toISOString(),
    });

  // Update scores
  const month = activity.activityDate.getMonth() + 1;
  const year = activity.activityDate.getFullYear();
  
  await updateUserScore(
    activity.fromUserId,
    month,
    year,
    activity.type,
    activity.points,
    activity.value || 0
  );
}

export async function getRecentActivities(limit: number = 50): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .select(`
      *,
      from_user:users!activities_user_id_fkey (id, name, email),
      to_user:users!activities_to_user_id_fkey (id, name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getActivitiesByUser(userId: number, limit: number = 50): Promise<Activity[]> {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .select('*')
    .or(`user_id.eq.${userId},to_user_id.eq.${userId}`)
    .order('activity_date', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as Activity[]) || [];
}

// ============================================
// GAMIFICATION FUNCTIONS
// ============================================

async function updateUserScore(
  userId: number,
  month: number,
  year: number,
  activityType: string,
  points: number,
  businessValue: number = 0
): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .eq('month', month)
    .eq('year', year)
    .single();

  if (existing) {
    const updates: any = {
      total_points: existing.total_points + points,
    };

    switch (activityType) {
      case 'referral':
        updates.referral_count = existing.referral_count + 1;
        break;
      case 'business':
        updates.business_count = existing.business_count + 1;
        updates.total_business_value = existing.total_business_value + businessValue;
        break;
      case 'meeting':
        updates.meeting_count = existing.meeting_count + 1;
        break;
      case 'testimonial':
        updates.testimonial_count = existing.testimonial_count + 1;
        break;
    }

    await supabaseAdmin
      .from('scores')
      .update(updates)
      .eq('user_id', userId)
      .eq('month', month)
      .eq('year', year);
  } else {
    await supabaseAdmin
      .from('scores')
      .insert({
        user_id: userId,
        month,
        year,
        total_points: points,
        referral_count: activityType === 'referral' ? 1 : 0,
        business_count: activityType === 'business' ? 1 : 0,
        meeting_count: activityType === 'meeting' ? 1 : 0,
        testimonial_count: activityType === 'testimonial' ? 1 : 0,
        total_business_value: activityType === 'business' ? businessValue : 0,
      });
  }
}

export async function getUserScore(userId: number, month?: number, year?: number): Promise<Score | undefined> {
  const now = new Date();
  const targetMonth = month || now.getMonth() + 1;
  const targetYear = year || now.getFullYear();

  const { data, error } = await supabaseAdmin
    .from('scores')
    .select('*')
    .eq('user_id', userId)
    .eq('month', targetMonth)
    .eq('year', targetYear)
    .single();

  if (error || !data) return undefined;
  return data as Score;
}

export async function getMonthlyLeaderboard(month?: number, year?: number, limit: number = 10): Promise<any[]> {
  const now = new Date();
  const targetMonth = month || now.getMonth() + 1;
  const targetYear = year || now.getFullYear();

  const { data, error } = await supabaseAdmin
    .from('scores')
    .select(`
      *,
      users!scores_user_id_fkey (id, name, email)
    `)
    .eq('month', targetMonth)
    .eq('year', targetYear)
    .order('total_points', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

// ============================================
// MEETING FUNCTIONS
// ============================================

export async function getAllMeetings(): Promise<Meeting[]> {
  const { data, error } = await supabaseAdmin
    .from('meetings')
    .select('*')
    .order('meeting_date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Meeting[]) || [];
}

export async function getMeetingsByGroup(groupId: number): Promise<Meeting[]> {
  const { data, error } = await supabaseAdmin
    .from('meetings')
    .select('*')
    .eq('group_id', groupId)
    .order('meeting_date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Meeting[]) || [];
}

export async function createMeeting(meeting: {
  groupId?: number;
  title: string;
  description?: string;
  meetingDate: Date;
  location?: string;
  createdBy: number;
}): Promise<void> {
  await supabaseAdmin
    .from('meetings')
    .insert({
      group_id: meeting.groupId,
      title: meeting.title,
      description: meeting.description,
      meeting_date: meeting.meetingDate.toISOString(),
      location: meeting.location,
      created_by: meeting.createdBy,
    });
}

export async function getMeetingGuests(meetingId: number): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('meeting_guests')
    .select(`
      *,
      guests!meeting_guests_guest_id_fkey (*)
    `)
    .eq('meeting_id', meetingId);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addGuestToMeeting(meetingId: number, guestId: number): Promise<void> {
  await supabaseAdmin
    .from('meeting_guests')
    .insert({
      meeting_id: meetingId,
      guest_id: guestId,
    });
}

// ============================================
// GUEST FUNCTIONS
// ============================================

export async function createGuest(guest: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  invitedBy: number;
  notes?: string;
}): Promise<void> {
  await supabaseAdmin
    .from('guests')
    .insert({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      company: guest.company,
      invited_by: guest.invitedBy,
      notes: guest.notes,
    });
}

export async function getAllGuests(): Promise<Guest[]> {
  const { data, error } = await supabaseAdmin
    .from('guests')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return (data as Guest[]) || [];
}

// ============================================
// CONTENT FUNCTIONS
// ============================================

export async function getAllContents(): Promise<Content[]> {
  const { data, error } = await supabaseAdmin
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Content[]) || [];
}

export async function getContentById(id: number): Promise<Content | undefined> {
  const { data, error } = await supabaseAdmin
    .from('contents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return data as Content;
}

export async function createContent(content: {
  title: string;
  description?: string;
  type: 'video' | 'document' | 'presentation' | 'link';
  url: string;
  category?: string;
  createdBy: number;
}): Promise<void> {
  await supabaseAdmin
    .from('contents')
    .insert({
      title: content.title,
      description: content.description,
      type: content.type,
      url: content.url,
      category: content.category,
      created_by: content.createdBy,
    });
}

// ============================================
// NOTIFICATION FUNCTIONS
// ============================================

export async function createNotification(notification: {
  userId: number;
  title: string;
  message: string;
  type?: string;
}): Promise<void> {
  await supabaseAdmin
    .from('notifications')
    .insert({
      user_id: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
    });
}

export async function getUserNotifications(userId: number, limit: number = 50): Promise<any[]> {
  const { data, error } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function markNotificationAsRead(id: number): Promise<void> {
  await supabaseAdmin
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
}
