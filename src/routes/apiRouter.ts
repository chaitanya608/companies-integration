import express, { Request } from "express";

import { Company, User } from "../models";
import { getAxios } from "../utils";

const router = express.Router();

type LoginRequest = {
  email: string;
  password: string;
};

type SelfSignupRequest = {
  companyDetails: {
    name: string;
    country: string;
    currency: string;
  };
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
};

type SelfSignupResponse = {
  issuerId: number;
};

type PartnerAssistedSelfSignupPayload = {
  legalName: string;
  countryOfIncorporation: string;
  currency: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
  };
  usagePreferences?: string[];
  referralCode?: string;
};

type PartnerAssistedSelfSignupResponse = {
  code: number;
  issuerId: number;
  message: string;
};

// Self signup
router.post(
  "/self-signup",
  async (req: Request<any, any, SelfSignupRequest>, res) => {
    const { companyDetails, userDetails } = req.body;
    let isUserSuccess = false;

    try {
      // Create new company
      const newCompany = new Company({
        name: companyDetails.name,
        country: companyDetails.country,
        currency: companyDetails.currency,
      });
      const companyResult = await newCompany.save();
      console.log(`Created company: ${companyResult._id}`);

      if (companyResult._id) {
        // Create new user
        const newUser = new User({
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: userDetails.email,
          password: userDetails.password,
          companies: [companyResult._id],
        });

        const userResult = await newUser.save();

        if (userResult._id) {
          isUserSuccess = true;
          console.log(`Created user: ${userResult._id}`);
        }
      }
    } catch (error) {
      res.status(400).json({ message: (error as any).message });
    }

    const partnerAssistedSelfSignupPayload: PartnerAssistedSelfSignupPayload = {
      legalName: companyDetails.name,
      countryOfIncorporation: companyDetails.country,
      currency: companyDetails.currency,
      contact: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
      },
      usagePreferences: [],
      referralCode: "",
    };

    const axios = getAxios();

    try {
      const partnerAssistedSelfSignupResponse =
        await axios.post<PartnerAssistedSelfSignupResponse>(
          "/onboarding/api/v1/partner/tenant-setup",
          partnerAssistedSelfSignupPayload
        );
      console.log({
        partnerAssistedSelfSignupResponse,
      });

      res.status(201).json({
        message: "Created issuer in Qmap",
        data: partnerAssistedSelfSignupResponse,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create issuer in Qmap",
        error,
      });
    }
  }
);

// Login
router.post("/login", async (req: Request<any, any, LoginRequest>, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: `Email and password are mandatory for login`,
    });
  }

  try {
    const userDetails = await User.findOne({
      email: req.body.email,
    });

    if (!userDetails?._id) {
      console.error(`User ${req.body.email} does not exist.`);
      return res.status(404).json({
        message: `User ${req.body.email} does not exist.`,
      });
    }

    if (userDetails.password === req.body.password) {
      res.status(200).json({
        message: `Login successfull for user ${req.body.email}`,
      });
    } else {
      res.status(400).json({
        message: `Password doesn't match for user ${req.body.email}. Please retry with correct password`,
      });
    }
  } catch (error) {
    console.error(`User ${req.body.email} does not exist.`);
    return res.status(404).json({
      message: `User ${req.body.email} does not exist.`,
    });
  }
});

// Get user by email
router.get("/user", async (req: Request<any, any, LoginRequest>, res) => {
  try {
    const userDetails = await User.findOne({
      email: req.query.email,
    });

    res.status(200).json({
      data: userDetails,
    });
  } catch (error) {
    console.error(`User ${req.body.email} not found`);
  }
});

export default router;
