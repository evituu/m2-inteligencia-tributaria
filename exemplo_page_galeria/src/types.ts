/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Photo {
  id: string;
  url: string;
  alt: string;
  caption: string;
  category: "sede" | "conferencia" | "teambuilding" | "bastidores";
  date: string;
  location: string;
  photographer?: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: "sede" | "conferencia" | "teambuilding" | "bastidores";
  date: string;
  location: string;
  photos: Photo[];
  stats?: {
    label: string;
    value: string;
  }[];
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  date: string;
  ctaUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
}
