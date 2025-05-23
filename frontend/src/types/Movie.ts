export interface Movie {
  showId: string;
  type?: string;
  title?: string;
  director?: string;
  cast?: string;
  country?: string;
  releaseYear?: number;
  rating?: string;
  duration?: string;
  description?: string;

  action?: number;
  adventure?: number;
  animeSeriesInternationalTVShows?: number;
  britishTVShowsDocuseriesInternationalTVShows?: number;
  children?: number;
  comedies?: number;
  comediesDramasInternationalMovies?: number;
  comediesInternationalMovies?: number;
  comediesRomanticMovies?: number;
  crimeTVShowsDocuseries?: number;
  documentaries?: number;
  documentariesInternationalMovies?: number;
  docuseries?: number;
  dramas?: number;
  dramasInternationalMovies?: number;
  dramasRomanticMovies?: number;
  familyMovies?: number;
  fantasy?: number;
  horrorMovies?: number;
  internationalMoviesThrillers?: number;
  internationalTVShowsRomanticTVShowsTVDramas?: number;
  kidsTV?: number;
  languageTVShows?: number;
  musicals?: number;
  natureTV?: number;
  realityTV?: number;
  spirituality?: number;
  tvAction?: number;
  tvComedies?: number;
  tvDramas?: number;
  talkShowsTVComedies?: number;
  thrillers?: number;

  averageRating: number;


}
