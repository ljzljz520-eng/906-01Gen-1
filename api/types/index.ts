export type VersionStatus = 'ACTIVE' | 'OBSOLETE' | 'SUPERSEDED';
export type UserRole = 'ENGINEER' | 'ADMIN';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: UserRole;
  passwordHash: string;
}

export interface Drawing {
  id: string;
  partNumber: string;
  name: string;
  process: string;
  equipmentModel: string;
  project: string;
  createdAt: string;
  thumbnail: string;
}

export interface DrawingVersion {
  id: string;
  drawingId: string;
  version: string;
  status: VersionStatus;
  releaseDate: string;
  releasedBy: string;
  fileFormat: string;
  fileSize: number;
  pageCount: number;
  replacesVersionId?: string;
  supersedesVersionId?: string;
  changeNotes: string;
}

export interface DownloadAuditLog {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  drawingId: string;
  partNumber: string;
  versionId: string;
  version: string;
  downloadedAt: string;
  ipAddress: string;
  watermarkCode: string;
}

export interface PublicUser {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: UserRole;
}

export interface DrawingFilter {
  partNumber?: string;
  process?: string;
  equipment?: string;
  version?: string;
  status?: VersionStatus[];
}

export interface AuditFilter {
  userId?: string;
  userName?: string;
  partNumber?: string;
  version?: string;
  from?: string;
  to?: string;
}
