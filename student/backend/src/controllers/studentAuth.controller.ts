import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { verifyStudentEmailDomain } from '../utils/domainVerification.js';
import { AuthProvider } from '@prisma/client';

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  collegeName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const googleAuthSchema = z.object({
  email: z.string().email('Valid Google email is required'),
  fullName: z.string().min(1, 'Name is required'),
  googleId: z.string().min(1, 'Google ID is required'),
  profileImageUrl: z.string().optional(),
  collegeName: z.string().optional(),
});

function signStudentToken(student: any): string {
  const secret = process.env.JWT_SECRET || 'katalyst_student_jwt_secret_key_2025_stem';
  const expiresIn = process.env.JWT_EXPIRES_IN || '14d';

  return jwt.sign(
    {
      id: student.id,
      email: student.email,
      fullName: student.fullName,
      isCollegeVerified: student.isCollegeVerified,
      verificationStatus: student.verificationStatus,
    },
    secret,
    { expiresIn: expiresIn as any }
  );
}

export const signupStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, password, collegeName } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in instead.',
      });
    }

    // Domain Verification Evaluation
    const verification = verifyStudentEmailDomain(cleanEmail);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const student = await prisma.studentUser.create({
      data: {
        fullName: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        collegeName: collegeName?.trim() || verification.institutionHint || null,
        collegeDomain: verification.domain,
        isCollegeVerified: verification.isCollegeVerified,
        verificationStatus: verification.verificationStatus,
        authProvider: AuthProvider.LOCAL,
      },
    });

    const token = signStudentToken(student);

    return res.status(201).json({
      success: true,
      message: verification.isCollegeVerified
        ? `Welcome to Katalyst! Verified College Account activated (${verification.institutionHint || verification.domain}).`
        : 'Welcome to Katalyst! Student account created successfully.',
      data: {
        token,
        student: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          collegeName: student.collegeName,
          isCollegeVerified: student.isCollegeVerified,
          verificationStatus: student.verificationStatus,
          createdAt: student.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const student = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'No student account found with this email. Please sign up first.',
      });
    }

    if (!student.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google Sign-In. Please click "Sign in with Google".',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, student.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials.',
      });
    }

    const token = signStudentToken(student);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        student: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          collegeName: student.collegeName,
          isCollegeVerified: student.isCollegeVerified,
          verificationStatus: student.verificationStatus,
          createdAt: student.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleStudentAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, fullName, googleId, profileImageUrl, collegeName } = req.body;
    const cleanEmail = email.toLowerCase().trim();

    const verification = verifyStudentEmailDomain(cleanEmail);

    let student = await prisma.studentUser.findUnique({
      where: { email: cleanEmail },
    });

    if (!student) {
      student = await prisma.studentUser.create({
        data: {
          email: cleanEmail,
          fullName: fullName.trim(),
          googleId,
          profileImageUrl: profileImageUrl || null,
          collegeName: collegeName?.trim() || verification.institutionHint || null,
          collegeDomain: verification.domain,
          isCollegeVerified: verification.isCollegeVerified,
          verificationStatus: verification.verificationStatus,
          authProvider: AuthProvider.GOOGLE,
        },
      });
    } else {
      student = await prisma.studentUser.update({
        where: { id: student.id },
        data: {
          googleId: googleId || student.googleId,
          profileImageUrl: profileImageUrl || student.profileImageUrl,
        },
      });
    }

    const token = signStudentToken(student);

    return res.status(200).json({
      success: true,
      message: verification.isCollegeVerified
        ? `Google Authentication verified with ${verification.institutionHint || verification.domain}`
        : 'Google Authentication successful',
      data: {
        token,
        student: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          collegeName: student.collegeName,
          isCollegeVerified: student.isCollegeVerified,
          verificationStatus: student.verificationStatus,
          profileImageUrl: student.profileImageUrl,
          createdAt: student.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const student = await prisma.studentUser.findUnique({
      where: { id: req.student.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        collegeName: true,
        collegeDomain: true,
        yearOfStudy: true,
        branch: true,
        isProfileComplete: true,
        isCollegeVerified: true,
        verificationStatus: true,
        authProvider: true,
        profileImageUrl: true,
        createdAt: true,
        scholarshipApplication: true,
        sessionRegistrations: {
          include: {
            event: true,
          },
          orderBy: { registeredAt: 'desc' },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found',
      });
    }

    // Check if student has a lead record in Admin portal
    const lead = await prisma.studentLead.findFirst({
      where: { email: student.email.toLowerCase().trim() },
      orderBy: { createdAt: 'desc' },
    });

    let effectiveVerificationStatus = student.verificationStatus;
    let effectiveIsCollegeVerified = student.isCollegeVerified;
    let applicationStatus = student.scholarshipApplication?.status || (lead?.status === 'ACCEPTED' ? 'ACCEPTED' : lead?.status === 'COMPLETED' ? 'SUBMITTED' : 'DRAFT');

    if (lead?.status === 'ACCEPTED') {
      effectiveVerificationStatus = 'VERIFIED_COLLEGE' as any;
      effectiveIsCollegeVerified = true;
      applicationStatus = 'ACCEPTED' as any;

      if (!student.isCollegeVerified || student.verificationStatus !== 'VERIFIED_COLLEGE') {
        try {
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: true,
              verificationStatus: 'VERIFIED_COLLEGE',
            },
          });
        } catch (e) {}
      }
    } else if (lead?.status === 'COMPLETED' || student.scholarshipApplication?.status === 'SUBMITTED') {
      applicationStatus = 'SUBMITTED' as any;
      effectiveVerificationStatus = 'GENERAL_STUDENT' as any;
      effectiveIsCollegeVerified = false;
    } else if (lead?.status === 'REJECTED') {
      effectiveVerificationStatus = 'GENERAL_STUDENT' as any;
      effectiveIsCollegeVerified = false;
      applicationStatus = 'REJECTED' as any;

      if (student.isCollegeVerified || student.verificationStatus === 'VERIFIED_COLLEGE') {
        try {
          await prisma.studentUser.update({
            where: { id: student.id },
            data: {
              isCollegeVerified: false,
              verificationStatus: 'GENERAL_STUDENT',
            },
          });
        } catch (e) {}
      }
    } else {
      if (student.scholarshipApplication?.status === 'ACCEPTED') {
        applicationStatus = lead?.status === 'COMPLETED' ? 'SUBMITTED' : (lead?.status || 'DRAFT');
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...student,
        verificationStatus: effectiveVerificationStatus,
        isCollegeVerified: effectiveIsCollegeVerified,
        leadStatus: lead?.status || (student.scholarshipApplication?.status === 'SUBMITTED' ? 'COMPLETED' : 'REGISTERED'),
        applicationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.student) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { fullName, phone, collegeName, yearOfStudy, branch, collegeEmail } = req.body;

    let updateData: any = {
      fullName: fullName?.trim(),
      phone: phone?.trim(),
      collegeName: collegeName?.trim(),
      yearOfStudy: yearOfStudy?.trim(),
      branch: branch?.trim(),
      isProfileComplete: true,
    };

    // If student enters college email to verify
    if (collegeEmail && typeof collegeEmail === 'string' && collegeEmail.includes('@')) {
      const verification = verifyStudentEmailDomain(collegeEmail);
      if (verification.isCollegeVerified) {
        updateData.isCollegeVerified = true;
        updateData.verificationStatus = verification.verificationStatus;
        updateData.collegeDomain = verification.domain;
        if (!updateData.collegeName && verification.institutionHint) {
          updateData.collegeName = verification.institutionHint;
        }
      }
    }

    const updatedStudent = await prisma.studentUser.update({
      where: { id: req.student.id },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        collegeName: true,
        collegeDomain: true,
        yearOfStudy: true,
        branch: true,
        isProfileComplete: true,
        isCollegeVerified: true,
        verificationStatus: true,
        authProvider: true,
        profileImageUrl: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Student profile updated successfully!',
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};
