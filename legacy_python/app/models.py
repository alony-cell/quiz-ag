from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# Enums
class ABTestStatus(str, Enum):
    DRAFT = "draft"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"

class SyncStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
    RUNNING = "running"

class QuestionType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TEXT = "text"
    TESTIMONIAL = "testimonial"
    PRODUCT_PAGE = "product_page"

class PageType(str, Enum):
    HOME = "home"
    QUIZ = "quiz"
    FORM = "form"
    THANKYOU = "thankyou"

# Entities

class ABQuizTest(BaseModel):
    name: str
    test_key: str
    variants: List[Dict[str, Any]] # Variant config and weights
    status: ABTestStatus
    is_active: bool

class BigQuerySyncState(BaseModel):
    entity_type: str
    last_synced_date: datetime
    status: SyncStatus
    last_run_message: Optional[str] = None
    last_run_timestamp: datetime
    records_synced: int

class ContactFormSettings(BaseModel):
    quiz_id: str
    headline: str
    description: str
    cta_button_text: str
    require_business_email: bool
    custom_fields: List[Dict[str, Any]]
    is_active: bool

class DesignSettings(BaseModel):
    quiz_id: str
    config_name: str
    design_config: Dict[str, Any] # Colors, fonts, etc.
    is_active: bool

class EmailNotificationSetting(BaseModel):
    quiz_id: str
    name: str
    is_enabled: bool
    recipient_emails: List[str]
    sender_name: str
    subject_template: str
    body_template: str

class FacebookPixelSetting(BaseModel):
    quiz_id: str
    pixel_id: str
    is_enabled: bool
    name: str

class GeneralSettings(BaseModel):
    quiz_id: str
    enable_intro_page: bool = True
    enable_auto_advance: bool = False
    show_progress_bar: bool = True
    allow_backward_navigation: bool = True
    show_branding: bool = True
    footer_text: Optional[str] = None
    enable_duplicate_check: bool = False
    duplicate_check_criteria: Optional[List[str]] = None

class GoogleTagManagerSetting(BaseModel):
    quiz_id: str
    gtm_id: str
    is_enabled: bool
    name: str

class HiddenField(BaseModel):
    quiz_id: str
    field_name: str
    source_type: str
    source_key: str
    constant_value: Optional[str] = None
    is_active: bool

class HubSpotSetting(BaseModel):
    quiz_id: str
    portal_id: str
    form_guid: str
    is_enabled: bool
    property_mappings: Dict[str, str]
    last_tested_at: Optional[datetime] = None

class IntroPageSettings(BaseModel):
    quiz_id: str
    name: str
    tagline: Optional[str] = None
    headline: str
    subheadline: Optional[str] = None
    cta_button_text: str
    cta_subtext: Optional[str] = None
    hero_image_url: Optional[str] = None
    feature_boxes_enabled: bool = False
    feature_boxes: List[Dict[str, Any]] = []
    social_proof_enabled: bool = False
    social_proof_headline: Optional[str] = None
    client_logos: List[str] = []
    testimonials: List[Dict[str, Any]] = []
    statistics_enabled: bool = False
    statistics: List[Dict[str, Any]] = []
    is_active: bool

class Lead(BaseModel):
    quiz_id: str
    session_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    quiz_score: Optional[float] = None
    quiz_outcome_headline: Optional[str] = None
    quiz_answers: Dict[str, Any]
    hidden_data: Dict[str, Any]
    submission_date: datetime

class Quiz(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    is_active: bool

class QuizInteraction(BaseModel):
    quiz_id: str
    session_id: str
    page_type: PageType
    question_id: Optional[str] = None
    answer_value: Optional[Any] = None
    timestamp: datetime

class QuizQuestion(BaseModel):
    quiz_id: str
    question_text: str
    question_subtitle: Optional[str] = None
    question_type: QuestionType
    question_order: int
    answers: List[Dict[str, Any]]
    content_image_url: Optional[str] = None
    info_bubble_text: Optional[str] = None
    testimonial_quote: Optional[str] = None
    product_page_title: Optional[str] = None
    is_active: bool

class QuizSession(BaseModel):
    quiz_id: str
    session_id: str
    started_at: datetime
    completed_at: Optional[datetime] = None
    form_completed_at: Optional[datetime] = None
    quiz_answers: Dict[str, Any] = {}
    quiz_result: Optional[Any] = None
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    ab_test_assignments: Dict[str, Any] = {}
    hidden_data: Dict[str, Any] = {}
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    referrer: Optional[str] = None

class ResultRule(BaseModel):
    quiz_id: str
    name: str
    min_score: float
    max_score: float
    thank_you_page_id: str
    is_active: bool

class ThankYouPage(BaseModel):
    quiz_id: str
    name: str
    headline: str
    body_content: str
    header_visual: Optional[str] = None
    cta_section_title: Optional[str] = None
    cta_section_content_type: Optional[str] = None
    cta_section_text: Optional[str] = None
    cta_section_image_url: Optional[str] = None
    cta_section_video_url: Optional[str] = None
    cta_buttons: List[Dict[str, Any]] = []
    case_studies: List[Dict[str, Any]] = []
    testimonials: List[Dict[str, Any]] = []
    monetary_value: Optional[float] = None
    is_default: bool
    is_active: bool

class TikTokPixelSetting(BaseModel):
    quiz_id: str
    pixel_id: str
    is_enabled: bool
    name: str

class User(BaseModel):
    id: str
    created_date: datetime
    updated_date: datetime
    full_name: str
    email: str
    role: str
