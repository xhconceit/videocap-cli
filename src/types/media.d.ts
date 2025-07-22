declare namespace MediaInfo {
  interface MediaInfo {
    streams: Stream[]
    format: Format
  }

  type Stream = VideoStream | AudioStream

  interface BaseStream {
    index: number
    codec_name: string
    codec_long_name: string
    codec_tag_string: string
    codec_tag: string
    time_base: string
    start_pts: number
    start_time: string
    extradata_size: number
    disposition: Disposition
    tags: StreamTags
  }

  interface VideoStream extends BaseStream {
    codec_type: 'video'
    profile: string
    width: number
    height: number
    coded_width: number
    coded_height: number
    closed_captions: number
    film_grain: number
    has_b_frames: number
    sample_aspect_ratio: string
    display_aspect_ratio: string
    pix_fmt: string
    level: number
    color_range: string
    color_space: string
    color_transfer: string
    color_primaries: string
    chroma_location: string
    field_order: string
    refs: number
    is_avc: string
    nal_length_size: string
    r_frame_rate: string
    avg_frame_rate: string
    bits_per_raw_sample: string
  }

  interface AudioStream extends BaseStream {
    codec_type: 'audio'
    sample_fmt: string
    sample_rate: string
    channels: number
    channel_layout: string
    bits_per_sample: number
    initial_padding: number
    r_frame_rate: string
    avg_frame_rate: string
  }

  interface Disposition {
    default: number
    dub: number
    original: number
    comment: number
    lyrics: number
    karaoke: number
    forced: number
    hearing_impaired: number
    visual_impaired: number
    clean_effects: number
    attached_pic: number
    timed_thumbnails: number
    non_diegetic: number
    captions: number
    descriptions: number
    metadata: number
    dependent: number
    still_image: number
  }

  interface StreamTags {
    HANDLER_NAME?: string
    VENDOR_ID?: string
    DURATION: string
    language?: string
  }

  interface Format {
    filename: string
    nb_streams: number
    nb_programs: number
    nb_stream_groups: number
    format_name: string
    format_long_name: string
    start_time: string
    duration: string
    size: string
    bit_rate: string
    probe_score: number
    tags: FormatTags
  }

  interface FormatTags {
    COMPATIBLE_BRANDS: string
    MAJOR_BRAND: string
    MINOR_VERSION: string
    ENCODER: string
  }
}

export = MediaInfo
export as namespace MediaInfo 