declare const manifest: Map<string, ManifestEntry>;
export default manifest;

export type ImageMetadata = {
    name: string,
    make: string | null,
    model: string | null,
    lens: string | null,

    iso: number | null,
    aperture: number | null,
    shutterSpeed: number | null,
    focalLength: number | null,
    timestamp: string | null,
    resolutionX: number | null,
    resolutionY: number | null,

    placesString: string | null,
    authorsString: string | null,

    faceHint: {
        x: number,
        y: number
    } | null,

    date: string | null,
    time: string | null,
    
    country: string | null,
    region: string | null,
    city: string | null,
    sublocation: string | null,

    photographer: string | null,
    editor: string | null,

    prettyAperture: string | null,
    prettyCamera: string | null,
    prettyResolution: string | null,
    prettyShutterSpeed: string | null
};
export type ManifestEntry = {
    meta: ImageMetadata,
    url: string,
    previous: string | null,
    next: string | null
};