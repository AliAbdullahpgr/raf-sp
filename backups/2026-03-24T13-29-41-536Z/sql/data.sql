SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict FCFvLg8nUDQXUdwCMEmD0q4lrTd58tXJOGdjsh7wRIcEDNz1MPjT4ZlJhz1IRT4

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: Department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Department" ("id", "name", "location", "logo", "createdAt", "updatedAt", "description", "designation", "email", "focalPerson", "phone", "secondaryEmail") FROM stdin;
cmj65jig30003d8tx4sbsz29n	Floriculture Research Sub-station	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:00.002	2025-12-14 20:03:00.002	Research and development in ornamental plants, landscaping, and floriculture production techniques.	Research Officer	asif.ali@mnsuam.edu.pk	Dr. Asif Ali	+92-61-9210073	\N
cmj65jju10008d8tx8thar91x	MNSUAM Estate & Facilities	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:01.801	2025-12-14 20:03:01.801	Management of university infrastructure, facilities, and estate operations.	Estate Manager	ahmad.hassan@mnsuam.edu.pk	Engr. Ahmad Hassan	+92-61-9210077	\N
cmj65jknw000bd8txo3usq4he	Agricultural Engineering Department	Multan Region	\N	2025-12-14 20:03:02.876	2025-12-14 20:03:02.876	Agricultural engineering services across Multan region including farm machinery, building infrastructure, and technical support for multiple divisions.	Director Agricultural Engineering	ahmad.hassan@mnsuam.edu.pk	Engr. Muhammad Akram	+92-61-9210077	\N
cmj65jkxr000cd8tx3t7uver1	Horticulture	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:03.231	2025-12-14 20:03:03.231	Research and education in fruit and vegetable production, post-harvest handling, and horticultural sciences.	Professor	rashid.ali@mnsuam.edu.pk	Dr. Rashid Ali	+92-61-9210078	\N
cmj65jl7n000dd8txvm257z5a	Plant Breeding and Genetics	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:03.587	2025-12-14 20:03:03.587	Development of improved crop varieties through conventional and modern breeding techniques.	Professor & Head	saeed.ahmad@mnsuam.edu.pk	Dr. Saeed Ahmad	+92-61-9210079	\N
cmj65jlhl000ed8txrlz5ftmf	Plant Pathology	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:03.944	2025-12-14 20:03:03.944	Research on plant diseases, disease management, and development of resistant varieties.	Professor	iftikhar.ahmad@mnsuam.edu.pk	Dr. Iftikhar Ahmad	+92-61-9210080	\N
cmj65jlrg000fd8txp2xikluo	Forestry and Range Management	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:04.3	2025-12-14 20:03:04.3	Forest conservation, range management, and sustainable natural resource utilization.	Professor	akram@mnsuam.edu.pk	Dr. Muhammad Akram	+92-61-9210081	\N
cmj65jm1e000gd8tx4er1juko	Animal Science	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:04.658	2025-12-14 20:03:04.658	Livestock production, animal nutrition, breeding, and veterinary sciences.	Professor & Head	zulfiqar.ali@mnsuam.edu.pk	Dr. Zulfiqar Ali	+92-61-9210082	\N
cmj65jmbe000hd8txux39aiau	Biotechnology	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:05.018	2025-12-14 20:03:05.018	Modern biotechnological approaches for crop improvement and agricultural innovation.	Associate Professor	farah.naz@mnsuam.edu.pk	Dr. Farah Naz	+92-61-9210083	\N
cmj65jml9000id8txqfqvpute	Water Management	MNS University of Agriculture, Multan	\N	2025-12-14 20:03:05.373	2025-12-14 20:03:05.373	Irrigation systems, water conservation, and efficient water use in agriculture.	Professor	ghulam.murtaza@mnsuam.edu.pk	Dr. Ghulam Murtaza	+92-61-9210084	\N
amri	Agricultural Mechanization Research Institute	Multan	\N	2025-12-14 20:03:01.444	2026-01-01 08:40:45.14	Research and development in farm machinery, mechanization technologies, and agricultural engineering for modern farming solutions.	Director (T&T)		Mr Ghulam Hussain	061-9200786	\N
mnsuam	Muhammad Nawaz Shareef University of Agriculture	Old Shujabad Road, Multan	\N	2025-12-14 20:07:13.03	2026-01-17 11:44:49.931	Vibrant agricultural university providing research-driven facilities, modern labs, and collaborative spaces for South Punjab Regional Agriculture Forum.		estatedata.focalperson@mnsuam.edu.pk	MNSUAM Focal Person		\N
soil-water	Soil & Water Testing Laboratory	Multan, Punjab	/images/soil.png.jpg	2025-12-14 20:05:25.219	2025-12-14 20:05:25.219	Comprehensive soil and water analysis services providing critical data for agricultural research and farmer support across the region.	Principal Scientist	swt_mltn@yahoo.com	Ms. Fatima Bibi	061-4423568	\N
pest	Pesticide Quality Control Laboratory	Multan, Punjab	\N	2025-12-14 20:06:37.12	2025-12-14 20:06:37.12	Quality control and testing of pesticides, ensuring safety standards and regulatory compliance for agricultural chemicals.	Senior Scientist	sd96850@gmail.com	Dr Subhan Danish	0304-7996951	\N
mri	Mango Research Institute	Multan, Punjab	\N	2025-12-14 20:06:51.306	2025-12-14 20:06:51.306	Dedicated research facility for mango cultivation, variety development, post-harvest technologies, and quality improvement.	Scientific Officer- Entomology	abidhameedkhan@yahoo.com	Mr. Abid Hameed Khan	0300-6326987	\N
flori	Floriculture Research Institute	Multan, Punjab	\N	2025-12-14 20:07:27.163	2025-12-14 20:07:27.163	Specialized research in ornamental plants, landscaping, floriculture production techniques, and horticultural development.	Assistant Research Officer	muzamil.ijaz243@gmail.com	Dr. Muhammad Muzamil Ijaz	03016984364	\N
cmj65ji5w0002d8txpc8kqokz	Regional Agricultural Research Institute (RARI), Bahawalpur	IUB - The Islamia University of Bahawalpur	\N	2025-12-14 20:02:59.636	2025-12-14 20:02:59.636	Research and development in ornamental plants, landscaping, and floriculture production techniques.	Research Officer	example1@example.com	Dr. Asif Ali	+92-61-9210073	\N
rari	Regional Agricultural Research Institute	Bahawalpur, Punjab	/images/rai.jpg.jpg	2025-12-14 20:05:49.879	2026-01-01 08:42:43.796	Comprehensive agricultural research focusing on crop improvement, plant protection, and sustainable farming practices for the region.	PRINCIPAL SCIENTIST	rari@agripunjab.gov.pk	RASHID MINHAS		\N
cri	Cotton Research Institute	Old Shujabad Road Multan	\N	2026-01-01 06:42:39.427	2026-01-01 06:42:39.427	Leading research in cotton cultivation, variety development, pest management, and fiber quality improvement for Pakistan's cotton industry.	Senior Scientist (Agronomy)	dircrimm@gmail.com	Dr. Muhammad Tauseef	+923340072357	\N
raedc	RAEDC	Vehari	\N	2026-01-01 06:51:01.646	2026-01-01 06:51:01.646	Regional Agricultural Economic Development Centre (RAEDC), Vehari - Specialized training and capacity-building institution	\N	raedc@agripunjab.gov.pk	Director, RAEDC	+92-XXX-XXXXXXX	\N
agri-ext	Agricultural Extension Wing	Multan	\N	2025-12-14 20:08:16.734	2026-01-01 06:51:17.214	Agricultural Extension Wing - Provincial Agriculture Department office providing extension services	\N	ext@agripunjab.gov.pk	Deputy Director Agriculture (Ext)	+92-XXX-XXXXXXX	\N
agri-eng	Agriculture Engineering	Multan, Pakistan	/images/agri.jpg.png	2025-12-14 20:04:52.178	2026-01-01 06:51:33.108	Agricultural Engineering Department responsible for land development, water conservation, and farm mechanization.	Director Agricultural (Technical) Multan	daemultan@yahoo.com	Mr. Muhammad Abdul Haye Faisal	0334-7456723	\N
erss	Entomological Research Sub-Station	Multan, Punjab	\N	2026-01-01 06:50:08.068	2026-01-01 07:40:22.46	Research on insect pests, beneficial insects, and integrated pest management strategies.	Principal Scientist	asifa_hameed_sheikh@yahoo.com	Dr. Asifa Hameed		\N
arc	Adaptive Research Center	Govt. Agri. Station Multan	/images/adp.jpg.jpg	2025-12-26 13:27:09.892	2026-01-01 08:15:14.747	Monthly vacancy position for the Office of Assistant Director Agriculture (Farm) at the Adaptive Research Center.	Govt. Agri. Station Multan		Office of Assistant Director Agriculture (Farm)		\N
agronomy	Agronomy Department	MNS University of Agriculture, Multan	\N	2026-01-01 08:23:46.609	2026-01-01 08:23:46.609	Specializes in crop production, soil management, and sustainable farming practices for improved agricultural productivity.	Assistant Professor	nabeel.ahmad@mnsuam.edu.pk	Dr. Nabeel Ahmad Ikram	+92-61-9210072	\N
food-science	Food Science and Technology	MNS University of Agriculture, Multan	\N	2026-01-01 06:49:52.913	2026-01-28 15:15:43.773	Focuses on the science of food, from production to consumption, including food safety, nutrition, and processing technologies.	Professor & Head	shabbir.ahmad@mnsuam.edu.pk	Dr. Shabbir Ahmad	+92-61-9210071	\N
\.


--
-- Data for Name: AMRIInventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."AMRIInventory" ("id", "name", "type", "imageUrl", "departmentId", "assetCategory", "itemDescription", "quantityOrArea", "functionalStatus", "remarks", "createdAt", "updatedAt", "status") FROM stdin;
cmjv73h7m00000otx033lw01d	Farm Area	Infrastructure	\N	amri	\N	\N	8 acres	\N	For field demonstration machinery and testing and trials	2026-01-01 08:40:45.538	2026-01-01 08:40:45.538	AVAILABLE
cmjv73hd200010otx9zocli93	Design Lab	Laboratory	\N	amri	\N	\N	1	\N	Designing of agricultural machinery by using 3D printers and autoCaD software	2026-01-01 08:40:45.734	2026-01-01 08:40:45.734	AVAILABLE
cmjv73hi700020otx0pwh9rf1	Workshop	Facility	\N	amri	\N	\N	1	\N	Manufacturing and repairing machinery by using a welding facility, conventional lathe machine, plasma cutter, CNC Miling and CNC lathe	2026-01-01 08:40:45.919	2026-01-01 08:40:45.919	AVAILABLE
cmjv73hnc00030otxffx6ldsp	Spray Lab	Laboratory	\N	amri	\N	\N	1	\N	Testing of Sprays and nozzles by using lab equipment i.e spray pump testers, drift test bench, gauge tester, independent nozzle tester	2026-01-01 08:40:46.104	2026-01-01 08:40:46.104	AVAILABLE
cmjv73hsj00040otxacq6dwza	Administrative Block	Infrastructure	\N	amri	\N	\N	2	\N	For the offices of ADG, Director(T&T) , Director(F&W), Director(D&D)	2026-01-01 08:40:46.291	2026-01-01 08:40:46.291	AVAILABLE
cmjv73hxp00050otxgedxr2ks	Machinery Sheds	Infrastructure	\N	amri	\N	\N	2	\N	For the parking and placement of machinery and implements	2026-01-01 08:40:46.477	2026-01-01 08:40:46.477	AVAILABLE
cmjv73i2x00060otx3ox7puuh	Disk Plow	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:46.665	2026-01-01 08:40:46.665	AVAILABLE
cmjv73i8200070otxp0fob2q6	Ditcher	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:46.85	2026-01-01 08:40:46.85	AVAILABLE
cmjv73idc00080otx0cjjosi7	Chisel Plow	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.04	2026-01-01 08:40:47.04	AVAILABLE
cmjv73iii00090otx726pqfe3	Border Disk	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.226	2026-01-01 08:40:47.226	AVAILABLE
cmjv73ino000a0otxeqtn98rw	Post Hole Digger	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.412	2026-01-01 08:40:47.412	AVAILABLE
cmjv73isu000b0otxbm9si8aw	Fertilizer Spreader	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.598	2026-01-01 08:40:47.598	AVAILABLE
cmjv73iy0000c0otxfi6m9t29	Disk Retoner	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.784	2026-01-01 08:40:47.784	AVAILABLE
cmjv73j34000d0otx80s85cka	Rice Straw Shredder	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:47.968	2026-01-01 08:40:47.968	AVAILABLE
cmjv73j89000e0otxf2rk7q1l	MB Plough 5-tine (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:48.153	2026-01-01 08:40:48.153	AVAILABLE
cmjv73jdf000f0otxmm4fwyg1	Trencher along with cross	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:48.339	2026-01-01 08:40:48.339	AVAILABLE
cmjv73jij000g0otxx9jsj4mi	Sprinkler Gun	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:48.523	2026-01-01 08:40:48.523	AVAILABLE
cmjv73jnn000h0otxetqpfhid	Jip Crane	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:48.707	2026-01-01 08:40:48.707	AVAILABLE
cmjv73jsq000i0otx8gdzu5mf	Wheat Bed Planter	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:48.89	2026-01-01 08:40:48.89	AVAILABLE
cmjv73jxu000j0otxc9yf50am	Double coulter Drill with Fertilizer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:49.074	2026-01-01 08:40:49.074	AVAILABLE
cmjv73k2x000k0otxg9dcbw73	Vegetable Seeder	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:49.257	2026-01-01 08:40:49.257	AVAILABLE
cmjv73k81000l0otx5m55wduj	Vegetable Planter	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:49.441	2026-01-01 08:40:49.441	AVAILABLE
cmjv73kd6000m0otxexr8uy5t	Maize Cob Harvester	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:49.626	2026-01-01 08:40:49.626	AVAILABLE
cmjv73kic000n0otxefcieha1	Mango Pruner	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:49.812	2026-01-01 08:40:49.812	AVAILABLE
cmjv73kng000o0otx7odsgelf	Hydraulic Trolley	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:49.996	2026-01-01 08:40:49.996	AVAILABLE
cmjv73ksk000p0otxxrn2svmy	Sugarcane Loader	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:50.18	2026-01-01 08:40:50.18	AVAILABLE
cmjv73kxp000q0otxotnuup0p	Sugarcane Crusher	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:50.365	2026-01-01 08:40:50.365	AVAILABLE
cmjv73l2u000r0otxwb5uqm70	Tadder (Class) 	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:50.549	2026-01-01 08:40:50.549	AVAILABLE
cmjv73l7y000s0otxj3se8r3s	Rack (Class)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:50.734	2026-01-01 08:40:50.734	AVAILABLE
cmjv73ld2000t0otxqslkj9qg	Silage Bailer 	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:50.918	2026-01-01 08:40:50.918	AVAILABLE
cmjv73li7000u0otx704h0huh	Sugarcane Loader (Local Made)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:51.103	2026-01-01 08:40:51.103	AVAILABLE
cmjv73lnc000v0otxzzat3rss	Onion Harvester	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:51.288	2026-01-01 08:40:51.288	AVAILABLE
cmjv73lsh000w0otxw5cy58ic	Hay Bailer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:51.473	2026-01-01 08:40:51.473	AVAILABLE
cmjv73lxv000x0otxda1zq71r	Hay Buster Drill (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:51.667	2026-01-01 08:40:51.667	AVAILABLE
cmjv73m31000y0otxtx1h7o09	Hay Buster Drill (Local)	Machinery	\N	amri	\N	\N	3 No	Functional	\N	2026-01-01 08:40:51.853	2026-01-01 08:40:51.853	AVAILABLE
cmjv73m86000z0otxkxwvc1yu	Rigger Vegetable	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.038	2026-01-01 08:40:52.038	AVAILABLE
cmjv73mdc00100otxuypxddr7	Cotton Ball Stripper	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.224	2026-01-01 08:40:52.224	AVAILABLE
cmjv73mii00110otxfweew0tn	Fruit Picker	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.41	2026-01-01 08:40:52.41	AVAILABLE
cmjv73mnn00120otx5xm2e6n0	Rotary Disk Harrow	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.595	2026-01-01 08:40:52.595	AVAILABLE
cmjv73msv00130otxvjwk3l1r	Wheat Bed & Farrow Drill	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.783	2026-01-01 08:40:52.783	AVAILABLE
cmjv73mxz00140otxz64fakcx	Bud Cutter	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:52.967	2026-01-01 08:40:52.967	AVAILABLE
cmjv73n3300150otxjr1r666x	Wheat Wrapper	Machinery	\N	amri	\N	\N	1 No	Functional 	\N	2026-01-01 08:40:53.151	2026-01-01 08:40:53.151	AVAILABLE
cmjv73n8800160otxql75hcpj	AMRI Super Seeder (Old)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:53.336	2026-01-01 08:40:53.336	AVAILABLE
cmjv73ndb00170otxdmz1fh7z	Walk Behind Reaper	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:53.519	2026-01-01 08:40:53.519	AVAILABLE
cmjv73nig00180otxstu04hwt	ULV Sprayer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:53.703	2026-01-01 08:40:53.703	AVAILABLE
cmjv73nnl00190otxj3wgt3af	Jecto/Canon Sprayer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:53.889	2026-01-01 08:40:53.889	AVAILABLE
cmjv73nsv001a0otxn56mkir4	Vegetable Nursery Transplanter with Ridger (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:54.079	2026-01-01 08:40:54.079	AVAILABLE
cmjv73ny3001b0otx2r8b98q8	Vegetable Nursery Transplanter (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:54.266	2026-01-01 08:40:54.266	AVAILABLE
cmjv73o37001c0otxm7b8z45c	Hay Bailer (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:54.451	2026-01-01 08:40:54.451	AVAILABLE
cmjv73o8b001d0otxxk6r0jae	Hay Bailer (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:54.635	2026-01-01 08:40:54.635	AVAILABLE
cmjv73odf001e0otxqy6w1njv	Rotary Tillage and fertilizer seeder (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:54.819	2026-01-01 08:40:54.819	AVAILABLE
cmjv73oii001f0otxje5vgngv	Inter Tillage weeder (Cultivator)	Machinery	\N	amri	\N	\N	2 No	Functional	\N	2026-01-01 08:40:55.002	2026-01-01 08:40:55.002	AVAILABLE
cmjv73onl001g0otxy6nr3kp9	Trimmer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:55.185	2026-01-01 08:40:55.185	AVAILABLE
cmjv73osq001h0otxf2y5v7xt	Orchard Sprayer	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:55.37	2026-01-01 08:40:55.37	AVAILABLE
cmjv73oxw001i0otx9sr1a5a8	Speed Cultivator	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:55.556	2026-01-01 08:40:55.556	AVAILABLE
cmjv73p2z001j0otxuko6fz3x	Sugarcane Base cutter	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:55.739	2026-01-01 08:40:55.739	AVAILABLE
cmjv73p83001k0otx21hpvg1l	Tadder (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:55.923	2026-01-01 08:40:55.923	AVAILABLE
cmjv73pd6001l0otx1uuy4yz7	Rack (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:56.106	2026-01-01 08:40:56.106	AVAILABLE
cmjv73pi9001m0otxs7ztzdrz	Vegetable Nursery Transplanter USA	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:56.289	2026-01-01 08:40:56.289	AVAILABLE
cmjv73pnd001n0otxv23w0orj	Vegetable Nursery Transplanter China	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:56.473	2026-01-01 08:40:56.473	AVAILABLE
cmjv73psh001o0otxbt30it0j	Onion Harvester (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:56.657	2026-01-01 08:40:56.657	AVAILABLE
cmjv73pxk001p0otxyaug2e3e	Rice Nursery Raising Machine	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:56.84	2026-01-01 08:40:56.84	AVAILABLE
cmjv73q2o001q0otxihcgbpfy	Hot Water Treatment Plant	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.024	2026-01-01 08:40:57.024	AVAILABLE
cmjv73q7v001r0otxdrjv2kwi	Garlic Weeder (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.211	2026-01-01 08:40:57.211	AVAILABLE
cmjv73qcz001s0otxzk8c3tfx	Rotary Slasher (Sugarcane)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.395	2026-01-01 08:40:57.395	AVAILABLE
cmjv73qi2001t0otxootlnkqr	Disc Harrow	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.578	2026-01-01 08:40:57.578	AVAILABLE
cmjv73qn5001u0otxhmxt3oul	Fruit Picker	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.761	2026-01-01 08:40:57.761	AVAILABLE
cmjv73qs9001v0otx6nk0zuab	Cotton Root Digger	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:57.945	2026-01-01 08:40:57.945	AVAILABLE
cmjv73qxd001w0otxkb2twbkv	Cotton Stock Shredder	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:58.129	2026-01-01 08:40:58.129	AVAILABLE
cmjv73r2j001x0otxuzikp62o	Cotton Root Digger	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:58.315	2026-01-01 08:40:58.315	AVAILABLE
cmjv73r7o001y0otxduyibjhy	Cultivator (5-tine)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:58.5	2026-01-01 08:40:58.5	AVAILABLE
cmjv73rcr001z0otxzteyx5t3	Rotary Slusher (Cotton)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:58.683	2026-01-01 08:40:58.683	AVAILABLE
cmjv73rhw00200otxhgv6twtp	Large Disc Harrow	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:58.868	2026-01-01 08:40:58.868	AVAILABLE
cmjv73rn100210otxw9dku1yj	MB Plough 3-bottom (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:59.053	2026-01-01 08:40:59.053	AVAILABLE
cmjv73rs400220otxh0g1on81	MB Plough 3-bottom (Local)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:59.236	2026-01-01 08:40:59.236	AVAILABLE
cmjv73rxa00230otxmda5nskr	MB Plough 2-bottom (Imported)	Machinery	\N	amri	\N	\N	1 No	Functional	\N	2026-01-01 08:40:59.422	2026-01-01 08:40:59.422	AVAILABLE
cmjv73s2f00240otxzjdcstkf	Rice Transplanter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:40:59.607	2026-01-01 08:40:59.607	AVAILABLE
cmjv73s7k00250otxhgkwjxf7	Sub Soiler	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:40:59.792	2026-01-01 08:40:59.792	AVAILABLE
cmjv73scp00260otxc14b4of4	Rotary Slasher	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:40:59.977	2026-01-01 08:40:59.977	AVAILABLE
cmjv73sht00270otxdj7tg3xu	Spring Tine Cultivator	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:00.161	2026-01-01 08:41:00.161	AVAILABLE
cmjv73smy00280otxwo8dnjny	Sugarcane set cutter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:00.346	2026-01-01 08:41:00.346	AVAILABLE
cmjv73ss200290otxr6f4vgmg	Self-Leveling boom sprayer	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:00.53	2026-01-01 08:41:00.53	AVAILABLE
cmjv73sx6002a0otxuui7mueb	Bed Shipper Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:00.714	2026-01-01 08:41:00.714	AVAILABLE
cmjv73t2b002b0otx758wbuya	Granular Distributor	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:00.899	2026-01-01 08:41:00.899	AVAILABLE
cmjv73t7g002c0otxk6ipexd2	AMRI Rotary Ditcher	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:01.084	2026-01-01 08:41:01.084	AVAILABLE
cmjv73tcn002d0otxfa56z531	Precision Sprayer (Local Made)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:01.271	2026-01-01 08:41:01.271	AVAILABLE
cmjv73thr002e0otxb0ligit2	Para Plough	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:01.455	2026-01-01 08:41:01.455	AVAILABLE
cmjv73tmv002f0otxtalkb9ek	Wheat Straw Bailer	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:01.639	2026-01-01 08:41:01.639	AVAILABLE
cmjv73trz002g0otxd8bcny9h	Runner Type Dry Sowing Drill	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:01.823	2026-01-01 08:41:01.823	AVAILABLE
cmjv73tx4002h0otxqmvhe5v3	Hand Fertilizer Spreader (AMRI Made)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.008	2026-01-01 08:41:02.008	AVAILABLE
cmjv73u29002i0otxislcb1si	Sugarcane Harvester	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.193	2026-01-01 08:41:02.193	AVAILABLE
cmjv73u7e002j0otxsigr6xhi	Chopper Blower	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.378	2026-01-01 08:41:02.378	AVAILABLE
cmjv73uea002k0otxj7ze06dk	Coulter Type (Drill Cotton)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.626	2026-01-01 08:41:02.626	AVAILABLE
cmjv73ujf002l0otxxrskmeyl	Hill Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.811	2026-01-01 08:41:02.811	AVAILABLE
cmjv73uoj002m0otx8aa9zsx1	Bracketing Machine	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:02.995	2026-01-01 08:41:02.995	AVAILABLE
cmjv73utp002n0otx8sbq4nz2	Rotary Harrow	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:03.181	2026-01-01 08:41:03.181	AVAILABLE
cmjv73uyx002o0otxnigqzvbn	Mechanical Hitch Cutter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:03.368	2026-01-01 08:41:03.368	AVAILABLE
cmjv73v40002p0otxrzhi0y0j	Garlic Harvester 	Machinery	\N	amri	\N	\N	2 No	Not Functional	\N	2026-01-01 08:41:03.552	2026-01-01 08:41:03.552	AVAILABLE
cmjv73v94002q0otx2slvcnx8	Fodder Cutter/Wrapper	Machinery	\N	amri	\N	\N	2 No	Not Functional	\N	2026-01-01 08:41:03.736	2026-01-01 08:41:03.736	AVAILABLE
cmjv73vea002r0otxos5wvqqq	Sugarcane Loader (Local Made)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:03.922	2026-01-01 08:41:03.922	AVAILABLE
cmjv73vjk002s0otx3l6g2s99	Garlic Harvester (Local Made)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:04.111	2026-01-01 08:41:04.111	AVAILABLE
cmjv73von002t0otxhjubh3eb	Forage Harvester	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:04.295	2026-01-01 08:41:04.295	AVAILABLE
cmjv73vtr002u0otxt203oona	Maize Rigger Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:04.479	2026-01-01 08:41:04.479	AVAILABLE
cmjv73vzh002v0otxkiekplp4	Rotary Rigger	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:04.685	2026-01-01 08:41:04.685	AVAILABLE
cmjv73w4n002w0otxfwya6gnj	Fodder Chopper Stationary	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:04.871	2026-01-01 08:41:04.871	AVAILABLE
cmjv73w9x002x0otx603bnp3a	Multicrop Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.061	2026-01-01 08:41:05.061	AVAILABLE
cmjv73wf1002y0otxa4fvjvrz	White Fly Shaker	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.245	2026-01-01 08:41:05.245	AVAILABLE
cmjv73wk7002z0otxxeussb5r	Small disc Harrow	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.431	2026-01-01 08:41:05.431	AVAILABLE
cmjv73wpb00300otxv1qk6jin	MB Plough Small	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.615	2026-01-01 08:41:05.615	AVAILABLE
cmjv73wug00310otxzq924ah6	Cultivator (7-tine)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.8	2026-01-01 08:41:05.8	AVAILABLE
cmjv73wzm00320otxk15dcwje	Garlic Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:05.986	2026-01-01 08:41:05.986	AVAILABLE
cmjv73x4r00330otx6f0gqbz5	Fodder Cutter disc mover (local)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:06.171	2026-01-01 08:41:06.171	AVAILABLE
cmjv73x9u00340otxfn0flub4	Garlic Harvester (Imported)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:06.354	2026-01-01 08:41:06.354	AVAILABLE
cmjv73xf200350otxwxwt0o3n	Wheat Straw Chopper Blower	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:06.542	2026-01-01 08:41:06.542	AVAILABLE
cmjv73xk800360otxy6uhsym6	Rota Drill	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:06.728	2026-01-01 08:41:06.728	AVAILABLE
cmjv73xpd00370otx5qq2d2q3	Rotary Drill	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:06.913	2026-01-01 08:41:06.913	AVAILABLE
cmjv73xug00380otxlroyl4h8	Single Coulter Drill	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:07.096	2026-01-01 08:41:07.096	AVAILABLE
cmjv73xzk00390otxri32l8z4	Carrot Washer (Engine)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:07.28	2026-01-01 08:41:07.28	AVAILABLE
cmjv73y4q003a0otx2uyfi4yc	Carrot Washer (Tractor Mounted)	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:07.466	2026-01-01 08:41:07.466	AVAILABLE
cmjv73y9w003b0otxpg1alt10	Double Coulter Drill with fertilizer	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:07.652	2026-01-01 08:41:07.652	AVAILABLE
cmjv73yf0003c0otx58muifpd	Sugarcane rotavator	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:07.836	2026-01-01 08:41:07.836	AVAILABLE
cmjv73yk4003d0otxv89zh7xk	Garlic Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:08.02	2026-01-01 08:41:08.02	AVAILABLE
cmjv73ype003e0otx6ju0seqw	Multi Crop Planter	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:08.21	2026-01-01 08:41:08.21	AVAILABLE
cmjv73yuj003f0otxcx5qfwei	Fodder Cutter Cum Chopper	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:08.395	2026-01-01 08:41:08.395	AVAILABLE
cmjv73yzn003g0otx0o6nkjzl	Wheat Straw Baler	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:08.579	2026-01-01 08:41:08.579	AVAILABLE
cmjv73z4r003h0otxj0ws872q	Laser Land Leveler	Machinery	\N	amri	\N	\N	1 No	Not Functional	\N	2026-01-01 08:41:08.763	2026-01-01 08:41:08.763	AVAILABLE
\.


--
-- Data for Name: AdaptiveResearchPosition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."AdaptiveResearchPosition" ("id", "attachedDepartment", "postName", "bpsScale", "sanctionedPosts", "filledPosts", "vacantPosts", "promotionPosts", "initialRecruitmentPosts", "remarks", "orderNumber", "departmentId", "createdAt", "updatedAt") FROM stdin;
cmjv66ohp0000iotxmg5kzzms	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Assistant Director (Farm)	BPS-18	1	1	0	0	0	\N	1	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0001iotx95gtwlmg	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Farm Manager / AO	BPS-17	1	1	0	0	0	\N	2	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0002iotxi3ktk1zm	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Senior Clerk	BPS-14	1	1	0	0	0	\N	3	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0003iotx9o33y1ph	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Field Investigator	BPS-14	1	1	0	0	0	\N	4	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0004iotx13wdxxj4	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Senior Field Assistant	BPS-12	2	0	2	2	0	\N	5	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0005iotxqqv4e4wm	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Field Assistant	BPS-11	3	2	1	0	1	\N	6	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0006iotx0o2ryz2n	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Junior Clerk	BPS-11	1	0	1	0	1	\N	7	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0007iotxbw0fonro	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Tractor Driver	BPS-06	1	1	0	0	0	\N	8	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0008iotx0fhe698h	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Carpenter	BPS-01	1	0	1	0	1	\N	9	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohp0009iotxac9glrhp	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Tube Well Operator	BPS-07	2	1	1	0	1	One vacant post is on LPR	10	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000aiotxffp2vfua	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Greaser	BPS-01	1	0	1	0	1	\N	11	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000biotxgzype53c	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Naib Qasid	BPS-02	1	1	0	0	0	\N	12	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000ciotxjjuqmp1q	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Chowkidar	BPS-03 & 05	2	1	1	0	1	\N	13	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000diotxd6bp0na3	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Field Man	BPS-03	1	0	1	0	1	\N	14	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000eiotx2klvj9qy	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Water Man	BPS-01	1	0	1	0	1	\N	15	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000fiotxqsqw5n29	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Tractor Cleaner	BPS-01	1	0	1	0	1	\N	16	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000giotxuj4obktk	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Beldar	BPS-01	22	14	8	0	8	\N	17	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
cmjv66ohq000hiotx8n9z5bte	DA (F.T & AR) Vehari / Assistant Director Agriculture (Farm) Govt. Agri. Station Multan	Mali	BPS-01	1	0	1	0	1	\N	18	arc	2026-01-01 08:15:15.145	2026-01-01 08:15:15.145
\.


--
-- Data for Name: Agri_Engineering_Multan_Region_Data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Agri_Engineering_Multan_Region_Data" ("id", "name", "type", "status", "imageUrl", "departmentId", "category", "divisionOrCity", "officeName", "quantityOrArea", "contactDetails", "createdAt", "updatedAt") FROM stdin;
cmjv371lr0000e4txfxxwfii2	Director Agricultural engineering Multan	Building Details	AVAILABLE	\N	agri-eng	\N	Multan	\N	8 acres 1 kanal	\N	2026-01-01 06:51:33.471	2026-01-01 06:51:33.471
cmjv371qu0001e4txngd1ogn1	Assistant Director Agriculturla Engineer Khanewal	Building Details	AVAILABLE	\N	agri-eng	\N	Multan	\N	2 acres 3 kanals	\N	2026-01-01 06:51:33.654	2026-01-01 06:51:33.654
cmjv371vt0002e4tx0f1t4oi5	Assistant Director Agriculturla Engineering Vehari	Building Details	AVAILABLE	\N	agri-eng	\N	Multan	\N	3 acres	\N	2026-01-01 06:51:33.833	2026-01-01 06:51:33.833
cmjv3720q0003e4txwevx5m58	Director Agricultural Engineering Bahawalpur	Building Details	AVAILABLE	\N	agri-eng	\N	Bahawalpur	\N	24 acres	\N	2026-01-01 06:51:34.01	2026-01-01 06:51:34.01
cmjv3725s0004e4txw4p9gtsj	Director Agricultural Engineering (Training Bahawalpur)	Building Details	AVAILABLE	\N	agri-eng	\N	Bahawalpur	\N	5 acres	\N	2026-01-01 06:51:34.192	2026-01-01 06:51:34.192
cmjv372an0005e4txfm0rjv83	Assistant Director Agricultural Engineering R.Y Khan	Building Details	AVAILABLE	\N	agri-eng	\N	Bahawalpur	\N	9.375 acre	\N	2026-01-01 06:51:34.367	2026-01-01 06:51:34.367
cmjv372fk0006e4txdsv4umvp	Assistant Director Agricultural Engineering Bahawalnagar	Building Details	AVAILABLE	\N	agri-eng	\N	Bahawalpur	\N	4 acres 06 kanal 2 marla	\N	2026-01-01 06:51:34.544	2026-01-01 06:51:34.544
cmjv372kj0007e4tx4fhjybpp	Director Agricultural Engineering, D.G Khan	Building Details	AVAILABLE	\N	agri-eng	\N	D.G Khan	\N	5 acres 7 kanal 4 marla	\N	2026-01-01 06:51:34.723	2026-01-01 06:51:34.723
cmjv372ph0008e4txkeso1wdd	Unit Supervisor Taunsa Sharif	Building Details	AVAILABLE	\N	agri-eng	\N	D.G Khan	\N	5 kanal	\N	2026-01-01 06:51:34.901	2026-01-01 06:51:34.901
cmjv372ud0009e4txsyox19km	Assistant Director Agricultural Engineering Muzaffargarh	Building Details	AVAILABLE	\N	agri-eng	\N	D.G Khan	\N	2 acre	\N	2026-01-01 06:51:35.077	2026-01-01 06:51:35.077
cmjv372z7000ae4tx9qjnjl44	Assistant Director Agricultural Engineering Rajanpur	Building Details	AVAILABLE	\N	agri-eng	\N	D.G Khan	\N	Rented	\N	2026-01-01 06:51:35.251	2026-01-01 06:51:35.251
cmjv37341000be4txitdeh1cr	Director Agricultural Engineering Layyah	Building Details	AVAILABLE	\N	agri-eng	\N	Layyah	\N	41 Kanal 10 marla	\N	2026-01-01 06:51:35.425	2026-01-01 06:51:35.425
cmjv3738w000ce4txo7jp5cnd	Unit Supervisor Layyah	Building Details	AVAILABLE	\N	agri-eng	\N	Layyah	\N	2 kanal	\N	2026-01-01 06:51:35.6	2026-01-01 06:51:35.6
cmjv373dv000de4txd7fnpjeo	Assistant Director Agricultural Engineering Bhakkar	Building Details	AVAILABLE	\N	agri-eng	\N	Layyah	\N	5 kanal	\N	2026-01-01 06:51:35.779	2026-01-01 06:51:35.779
cmjv373iu000ee4txuamxcyw8	Agricultural Engineering Workshop Sahiwal	Building Details	AVAILABLE	\N	agri-eng	\N	Sahiwal	\N	2 acre, 6 kanal	\N	2026-01-01 06:51:35.958	2026-01-01 06:51:35.958
cmjv373np000fe4txvb2htqya	Agricultural Engineering Workshop Okara	Building Details	AVAILABLE	\N	agri-eng	\N	Sahiwal	\N	Rented	\N	2026-01-01 06:51:36.133	2026-01-01 06:51:36.133
cmjv373sl000ge4txijx7dttj	Director Agricultural Engineering Multan	Farm Machinery	AVAILABLE	\N	agri-eng	Bulldozers	\N	\N	24	\N	2026-01-01 06:51:36.309	2026-01-01 06:51:36.309
cmjv373xh000he4txk4jr6kfu	Director Agricultural Engineering Sahiwal	Farm Machinery	AVAILABLE	\N	agri-eng	Bulldozers	\N	\N	7	\N	2026-01-01 06:51:36.484	2026-01-01 06:51:36.484
cmjv3742a000ie4txcsstvkzn	Director Agricultural Engineering D.G Khan	Farm Machinery	AVAILABLE	\N	agri-eng	Bulldozers	\N	\N	35	\N	2026-01-01 06:51:36.658	2026-01-01 06:51:36.658
cmjv37477000je4txed4eezyi	Director Agricultural Engineering Layyah	Farm Machinery	AVAILABLE	\N	agri-eng	Bulldozers	\N	\N	23	\N	2026-01-01 06:51:36.835	2026-01-01 06:51:36.835
cmjv374c4000ke4txjkpq6sf6	Director Agricultural Engineering Bahawalpur	Farm Machinery	AVAILABLE	\N	agri-eng	Bulldozers	\N	\N	42	\N	2026-01-01 06:51:37.012	2026-01-01 06:51:37.012
cmjv374gx000le4tx5lbes5io	Director Agricultural Engineering Multan	Farm Machinery	AVAILABLE	\N	agri-eng	Hand Boring Plants	\N	\N	6	\N	2026-01-01 06:51:37.185	2026-01-01 06:51:37.185
cmjv374ls000me4txj7wifsgu	Director Agricultural Engineering Sahiwal	Farm Machinery	AVAILABLE	\N	agri-eng	Hand Boring Plants	\N	\N	4	\N	2026-01-01 06:51:37.36	2026-01-01 06:51:37.36
cmjv374qn000ne4tx56chfic7	Director Agricultural Engineering D.G Khan	Farm Machinery	AVAILABLE	\N	agri-eng	Hand Boring Plants	\N	\N	2	\N	2026-01-01 06:51:37.535	2026-01-01 06:51:37.535
cmjv374vo000oe4tx79i9c5zl	Director Agricultural Engineering Layyah	Farm Machinery	AVAILABLE	\N	agri-eng	Hand Boring Plants	\N	\N	4	\N	2026-01-01 06:51:37.716	2026-01-01 06:51:37.716
cmjv3750r000pe4txagl9jkvb	Director Agricultural Engineering Bahawalpur	Farm Machinery	AVAILABLE	\N	agri-eng	Hand Boring Plants	\N	\N	6	\N	2026-01-01 06:51:37.899	2026-01-01 06:51:37.899
cmjv37562000qe4txvvzd1xo0	Director Agricultural Engineering D.G Khan	Farm Machinery	AVAILABLE	\N	agri-eng	Power Drilling Rigs	\N	\N	3	\N	2026-01-01 06:51:38.09	2026-01-01 06:51:38.09
cmjv375bs000re4tx2zl69zu9	Director Agricultural Engineering Multan	Farm Machinery	AVAILABLE	\N	agri-eng	Electric Resistivity Meters	\N	\N	3	\N	2026-01-01 06:51:38.296	2026-01-01 06:51:38.296
cmjv375gp000se4txvg3wh3ik	Director Agricultural Engineering Sahiwal	Farm Machinery	AVAILABLE	\N	agri-eng	Electric Resistivity Meters	\N	\N	2	\N	2026-01-01 06:51:38.473	2026-01-01 06:51:38.473
cmjv375ly000te4txwqczx2rc	Director Agricultural Engineering D.G Khan	Farm Machinery	AVAILABLE	\N	agri-eng	Electric Resistivity Meters	\N	\N	3	\N	2026-01-01 06:51:38.662	2026-01-01 06:51:38.662
cmjv375rc000ue4txes4s3wst	Director Agricultural Engineering Layyah	Farm Machinery	AVAILABLE	\N	agri-eng	Electric Resistivity Meters	\N	\N	1	\N	2026-01-01 06:51:38.856	2026-01-01 06:51:38.856
cmjv375w7000ve4tx8294xe7h	Director Agricultural Engineering Bahawalpur	Farm Machinery	AVAILABLE	\N	agri-eng	Electric Resistivity Meters	\N	\N	3	\N	2026-01-01 06:51:39.031	2026-01-01 06:51:39.031
cmjv37611000we4txg2ftnzyf	Additional Director General (Agricultural Engineering), Multan	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	30	\N	2026-01-01 06:51:39.205	2026-01-01 06:51:39.205
cmjv3765x000xe4txix667432	Director Agricultural Engineering (M&E), Multan	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	6	\N	2026-01-01 06:51:39.381	2026-01-01 06:51:39.381
cmjv376b8000ye4tx6vh0gt2n	Director Agricultural Engineering Multan	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	136	\N	2026-01-01 06:51:39.572	2026-01-01 06:51:39.572
cmjv376g8000ze4txylb0v9x4	Director Agricultural Engineering Bahawalpur	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	209	\N	2026-01-01 06:51:39.752	2026-01-01 06:51:39.752
cmjv376li0010e4txkfgrgumq	Director Agricultural Engineering D.G Khan	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	136	\N	2026-01-01 06:51:39.942	2026-01-01 06:51:39.942
cmjv376qn0011e4tx83crl8zq	Director Agricultural Engineering Layyah	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	115	\N	2026-01-01 06:51:40.127	2026-01-01 06:51:40.127
cmjv376vp0012e4tx59jdbvmc	Director Agricultural Engineering Sahiwal	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	36	\N	2026-01-01 06:51:40.309	2026-01-01 06:51:40.309
cmjv3770m0013e4tx2d24ozk8	Director Agricultural Engineering (Training), Bahawalpur	Human Resources	AVAILABLE	\N	agri-eng	\N	\N	\N	24	\N	2026-01-01 06:51:40.486	2026-01-01 06:51:40.486
\.


--
-- Data for Name: AgriculturalExtensionWing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."AgriculturalExtensionWing" ("id", "name", "type", "location", "areaSquareFeet", "remarks", "status", "functionality", "departmentId", "createdAt", "updatedAt", "equipmentStatus") FROM stdin;
cmjv36pcf00000otxsbs5h38n	Office of the Deputy Director Agriculture (Ext)	Administrative Office	Old Shujabad Road Agriculture Complex, Multan	288585	Agriculture Department (Ext) Wing	Utilized	Operational	agri-ext	2026-01-01 06:51:17.583	2026-01-01 06:51:17.583	AVAILABLE
cmjv36phq00010otxd6ifue23	SAO / EADA	Administrative Office	Dera Adda, Behind Telephone Exchange, Multan	13056	Dismantled from Building Department	Un used	Operational	agri-ext	2026-01-01 06:51:17.774	2026-01-01 06:51:17.774	AVAILABLE
cmjv36po600020otxs8xu0crz	Office of the Assistant Director Agriculture (Ext)	Administrative Office	Old Multan Road, Near Boys High School, Shujabad	89100	Agriculture Department	Utilized	Operational	agri-ext	2026-01-01 06:51:18.006	2026-01-01 06:51:18.006	AVAILABLE
cmjv36pv400030otxxx96yooz	Office of the Assistant Director Agriculture (Ext)	Administrative Office	Shujabad Road, Near Virtual University, Jalalpur Pirwala	\N	Temporarily adjusted in Health Department Building	Utilized	Operational	agri-ext	2026-01-01 06:51:18.256	2026-01-01 06:51:18.256	AVAILABLE
\.


--
-- Data for Name: AgronomyLabEquipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."AgronomyLabEquipment" ("id", "name", "type", "imageUrl", "departmentId", "quantity", "focalPerson1", "displayOrder", "createdAt", "updatedAt", "status") FROM stdin;
cmj65ozhg000c8otxw5r8pk9r	Analytical Balance	Balances & Scales	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	1	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000d8otx6gf686cq	Digital Balance	Balances & Scales	\N	mnsuam	3	Dr. Nabeel Ahmad Ikram	2	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000e8otxt547kog5	Top Loading Balance	Balances & Scales	\N	mnsuam	2	Dr. Nabeel Ahmad Ikram	3	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000f8otx5rvhbv46	Leaf Area Meter	Meters & Sensors	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	4	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000g8otx25lrzc9i	Flame Photometer	Analytical Instruments	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	5	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000h8otxx4hswa3f	SPAD	Meters & Sensors	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	6	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000i8otx8fllhwg2	pH Meter	Meters & Sensors	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	7	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000j8otxgcnrodck	EC Meter	Meters & Sensors	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	8	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000k8otx8x4d37af	Autoclave	Sterilization	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	9	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhg000l8otxxrh1e1x0	Cooling Incubator	Incubation	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	10	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000m8otxq7i0kq1h	Oven	Processing Equipment	\N	mnsuam	2	Dr. Nabeel Ahmad Ikram	11	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000n8otxkxikoi9x	Trinocular Microscope	Microscopy	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	12	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000o8otxao95m762	Hot Plate & Magnetic Stirrer	Processing Equipment	\N	mnsuam	2	Dr. Nabeel Ahmad Ikram	13	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000p8otxyz1vb470	Moisture Meter	Meters & Sensors	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	14	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000q8otxczp8h00g	Water Distillation Unit	Water Systems	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	15	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000r8otx223utwg0	Water Bath	Processing Equipment	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	16	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000s8otxpv5orm1n	Mini Centrifuge Machine	Separation	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	17	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000t8otxg6vheqfo	Spectrophotometer	Analytical Instruments	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	18	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000u8otxkutj3i4n	Seed Grinder	Processing Equipment	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	19	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000v8otx3bbc70h5	Kjeldahl Apparatus	Analytical Instruments	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	20	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000w8otxu63rqlf5	Digital Vernier Caliper	Measurement Tools	\N	mnsuam	1	Dr. Nabeel Ahmad Ikram	21	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmj65ozhh000x8otxs3n5w8o6	Aquarium Pump	Support Equipment	\N	mnsuam	2	Dr. Nabeel Ahmad Ikram	22	2025-12-14 20:07:15.191	2025-12-14 20:07:15.191	AVAILABLE
cmjv6hnfz0000qgtxsgr4xv8e	Analytical Balance	Balances & Scales	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	1	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hnfz0001qgtxzrpaf2jg	Digital Balance	Balances & Scales	\N	agronomy	3	Dr. Nabeel Ahmad Ikram	2	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hnfz0002qgtxsoti8nho	Top Loading Balance	Balances & Scales	\N	agronomy	2	Dr. Nabeel Ahmad Ikram	3	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hnfz0003qgtx5rkdu7ap	Leaf Area Meter	Meters & Sensors	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	4	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hnfz0004qgtx1axedb4p	Flame Photometer	Analytical Instruments	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	5	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng00005qgtxtwa5u85v	SPAD	Meters & Sensors	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	6	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng00006qgtxkw0k9tez	pH Meter	Meters & Sensors	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	7	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng00007qgtxscsi2q1m	EC Meter	Meters & Sensors	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	8	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng00008qgtx0di0aa7a	Autoclave	Sterilization	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	9	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng00009qgtxk56ljnz2	Cooling Incubator	Incubation	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	10	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000aqgtxcqkipdbo	Oven	Processing Equipment	\N	agronomy	2	Dr. Nabeel Ahmad Ikram	11	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000bqgtxkdslrdix	Trinocular Microscope	Microscopy	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	12	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000cqgtxhiobd1sw	Hot Plate & Magnetic Stirrer	Processing Equipment	\N	agronomy	2	Dr. Nabeel Ahmad Ikram	13	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000dqgtxiueyrzd9	Moisture Meter	Meters & Sensors	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	14	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000eqgtxghe1okez	Water Distillation Unit	Water Systems	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	15	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000fqgtxhake1ch1	Water Bath	Processing Equipment	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	16	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000gqgtxr57aegdm	Mini Centrifuge Machine	Separation	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	17	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000hqgtxkb9pq39u	Spectrophotometer	Analytical Instruments	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	18	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000iqgtxd1nzbxoq	Seed Grinder	Processing Equipment	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	19	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000jqgtx5n49osal	Kjeldahl Apparatus	Analytical Instruments	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	20	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000kqgtxs70vj60p	Digital Vernier Caliper	Measurement Tools	\N	agronomy	1	Dr. Nabeel Ahmad Ikram	21	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
cmjv6hng0000lqgtxej2nwrfv	Aquarium Pump	Support Equipment	\N	agronomy	2	Dr. Nabeel Ahmad Ikram	22	2026-01-01 08:23:46.999	2026-01-01 08:23:46.999	AVAILABLE
\.


--
-- Data for Name: CRIMultanAssets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."CRIMultanAssets" ("id", "name", "type", "imageUrl", "departmentId", "makeModel", "labDepartment", "purposeFunction", "year", "location", "quantity", "operationalStatus", "description", "createdAt", "updatedAt", "status") FROM stdin;
cmjv2vlti0000uwtxz83r70dm	Electrical Penetration Graph	Laboratory Equipment	\N	cri	GIGA-8d DC amplifier	Integrated Pest Management Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:39.798	2026-01-01 06:42:39.798	AVAILABLE
cmjv2vlyw0001uwtxmcrrw9bb	Electrical Germinator	Laboratory Equipment	\N	cri	Theijang Top Cloud Agri Tech. Co. Ltd	Integrated Pest Management Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:39.992	2026-01-01 06:42:39.992	AVAILABLE
cmjv2vm560002uwtx6udo1u7q	Spectrophotometer	Laboratory Equipment	\N	cri	K5600S-KAIRO	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:40.218	2026-01-01 06:42:40.218	AVAILABLE
cmjv2vmfg0004uwtxqsyqmzaw	Atomic Absorption Spectroscopy	Laboratory Equipment	\N	cri	AA6100+	Analytical Laboratory	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:40.588	2026-01-01 06:42:40.588	AVAILABLE
cmjv2vmll0005uwtxfylyo4cw	Digital Droplet PCR	Laboratory Equipment	\N	cri	D3200PRO	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:40.809	2026-01-01 06:42:40.809	AVAILABLE
cmjv2vmr70006uwtxgr7jd89m	Automatic DNA Extraction Unit	Laboratory Equipment	\N	cri	BFEX-96E	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:41.011	2026-01-01 06:42:41.011	AVAILABLE
cmjv2vmwk0007uwtxtux7dt4c	Tissue Grinder	Laboratory Equipment	\N	cri	NO3D13	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:41.204	2026-01-01 06:42:41.204	AVAILABLE
cmjv2vn3q0008uwtxddar28wq	Fluorescence Microscope	Laboratory Equipment	\N	cri	MF-43M	Analytical Laboratory	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:41.462	2026-01-01 06:42:41.462	AVAILABLE
cmjv2vn8s0009uwtxf5ti88gl	Incubator	Laboratory Equipment	\N	cri	MDS-200	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:41.644	2026-01-01 06:42:41.644	AVAILABLE
cmjv2vndu000auwtxf84ghcvw	Freezer -20°C	Laboratory Equipment	\N	cri	MDF-40H485	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:41.826	2026-01-01 06:42:41.826	AVAILABLE
cmjv2vniv000buwtxfib5t5w0	Refrigerated Centrifuge	Laboratory Equipment	\N	cri	Velocity30R	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:42.007	2026-01-01 06:42:42.007	AVAILABLE
cmjv2vnny000cuwtxuitj77hd	Stereoscope	Laboratory Equipment	\N	cri	Euromex Microscopes Holland	Integrated Pest Management Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:42.189	2026-01-01 06:42:42.189	AVAILABLE
cmjv2vnty000duwtxbfg6dqlw	Light Microscope	Laboratory Equipment	\N	cri	Euromex Microscopes Holland	Integrated Pest Management Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:42.406	2026-01-01 06:42:42.406	AVAILABLE
cmjv2vo08000euwtxnqq20jdb	IRGA	Laboratory Equipment	\N	cri	CID BIOSCIENCE CI-340	Laboratory of Physiology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:42.632	2026-01-01 06:42:42.632	AVAILABLE
cmjv2vo5f000fuwtx0u4ote1j	Drying Oven	Laboratory Equipment	\N	cri	RΔYPΔ	Integrated Pest Management Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:42.819	2026-01-01 06:42:42.819	AVAILABLE
cmjv2voai000guwtxrz6pcyjp	Gradient PCR	Laboratory Equipment	\N	cri	FC-96B	Laboratory of Molecular Biology	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:43.002	2026-01-01 06:42:43.002	AVAILABLE
cmjv2vofk000huwtxqdsv623m	HVI	Laboratory Equipment	\N	cri	Uster HVI-1000	Fiber Testing Laboratory	\N	\N	\N	1	Functional	\N	2026-01-01 06:42:43.184	2026-01-01 06:42:43.184	AVAILABLE
cmjv2vokn000iuwtxeocq39in	Massey Ferguson-375	Farm Machinery	\N	cri	\N	\N	\N	1999	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:43.367	2026-01-01 06:42:43.367	AVAILABLE
cmjv2vopp000juwtxsiomf6we	Massey Ferguson-240	Farm Machinery	\N	cri	\N	\N	\N	1991	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:43.549	2026-01-01 06:42:43.549	AVAILABLE
cmjv2vous000kuwtx0lnrmkxy	Cultivator (13-tines)	Farm Machinery	\N	cri	\N	\N	\N	2012	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:43.732	2026-01-01 06:42:43.732	AVAILABLE
cmjv2vozu000luwtxwwoxha9e	Chisel Plough	Farm Machinery	\N	cri	\N	\N	\N	1998	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:43.914	2026-01-01 06:42:43.914	AVAILABLE
cmjv2vp4v000muwtxhrpg9igb	Trolley for Tractor (12X7ft)	Farm Machinery	\N	cri	\N	\N	\N	-	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:44.095	2026-01-01 06:42:44.095	AVAILABLE
cmjv2vp9y000nuwtxh0r3xp27	Disc Plough	Farm Machinery	\N	cri	\N	\N	\N	2017	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:44.278	2026-01-01 06:42:44.278	AVAILABLE
cmjv2vpez000ouwtx4sbcom0h	Fertilizer Spreader	Farm Machinery	\N	cri	\N	\N	\N	2000	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:44.459	2026-01-01 06:42:44.459	AVAILABLE
cmjv2vpjz000puwtxrtlf9mvf	Land Leveler	Farm Machinery	\N	cri	\N	\N	\N	2014	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:44.639	2026-01-01 06:42:44.639	AVAILABLE
cmjv2vpp0000quwtxm8ja8j5g	Boom Sprayer	Farm Machinery	\N	cri	\N	\N	\N	2008	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:44.82	2026-01-01 06:42:44.82	AVAILABLE
cmjv2vpu2000ruwtxiapgbw6l	Laser Land Leveler	Farm Machinery	\N	cri	\N	\N	\N	2016	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.002	2026-01-01 06:42:45.002	AVAILABLE
cmjv2vpz3000suwtxlivpjnpk	Ridger for Bed & Furrow	Farm Machinery	\N	cri	\N	\N	\N	1998	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.183	2026-01-01 06:42:45.183	AVAILABLE
cmjv2vq4v000tuwtx7dr3wysi	Automatic Kharif Drill	Farm Machinery	\N	cri	\N	\N	\N	2018	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.391	2026-01-01 06:42:45.391	AVAILABLE
cmjv2vq9x000uuwtxbjvcm5xe	Rotavator (42 blades)	Farm Machinery	\N	cri	\N	\N	\N	2012	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.573	2026-01-01 06:42:45.573	AVAILABLE
cmjv2vqez000vuwtxjp5jdhiu	Water Tank	Farm Machinery	\N	cri	\N	\N	\N	2017	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.755	2026-01-01 06:42:45.755	AVAILABLE
cmjv2vqk1000wuwtxm4gejgd7	Timmy Rotary Weeder	Farm Machinery	\N	cri	\N	\N	\N	1999	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:45.937	2026-01-01 06:42:45.937	AVAILABLE
cmjv2vqp3000xuwtxz0jm4li1	Cotton Ridger with Fertilizer	Farm Machinery	\N	cri	\N	\N	\N	1998	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:46.119	2026-01-01 06:42:46.119	AVAILABLE
cmjv2vqu5000yuwtxcv5imxnz	Cotton Hand Drill	Farm Machinery	\N	cri	\N	\N	\N	2005	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:46.301	2026-01-01 06:42:46.301	AVAILABLE
cmjv2vmab0003uwtxdpug7ygj	HPLC	Laboratory Equipment	\N	cri	GB/T26792-2019	Analytical Laboratory	\N	\N	\N	1	Non-Functional	\N	2026-01-01 06:42:40.403	2026-02-24 10:42:27.281	IN_USE
cmjv2vqz7000zuwtxib79hvoc	Tractor Driven Tarphali	Farm Machinery	\N	cri	\N	\N	\N	2008	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:46.483	2026-01-01 06:42:46.483	AVAILABLE
cmjv2vr4e0010uwtxend08ikl	Disc Harrow	Farm Machinery	\N	cri	\N	\N	\N	2016	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:46.67	2026-01-01 06:42:46.67	AVAILABLE
cmjv2vr9g0011uwtxop56gomz	Ditcher	Farm Machinery	\N	cri	\N	\N	\N	2017	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:46.852	2026-01-01 06:42:46.852	AVAILABLE
cmjv2vrej0012uwtxu4ogu3om	Wheat Straw Slasher	Farm Machinery	\N	cri	\N	\N	\N	2017	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:47.035	2026-01-01 06:42:47.035	AVAILABLE
cmjv2vrjn0013uwtx9ehx8q33	Thresher with Elevator	Farm Machinery	\N	cri	\N	\N	\N	2018	CRI, Farm Shed	1	Functional	\N	2026-01-01 06:42:47.219	2026-01-01 06:42:47.219	AVAILABLE
cmjv2vroq0014uwtxcoyshr1c	Total Area	Land	🌱	cri	\N	\N	\N	\N	\N	1	\N	24.6 acres	2026-01-01 06:42:47.402	2026-01-01 06:42:47.402	AVAILABLE
cmjv2vrtt0015uwtx97548dwp	Under Cultivation	Land	🌾	cri	\N	\N	\N	\N	\N	1	\N	19.6 acres	2026-01-01 06:42:47.585	2026-01-01 06:42:47.585	AVAILABLE
cmjv2vryw0016uwtxhbl43ym1	Buildings & Infrastructure	Land	🏢	cri	\N	\N	\N	\N	\N	1	\N	4 acres	2026-01-01 06:42:47.768	2026-01-01 06:42:47.768	AVAILABLE
cmjv2vs3y0017uwtxb4yg6xkn	Roads & Pathways	Land	🛣️	cri	\N	\N	\N	\N	\N	1	\N	1 acre	2026-01-01 06:42:47.95	2026-01-01 06:42:47.95	AVAILABLE
cmjv2vs900018uwtxmkfjdqus	Building Rooms	Infrastructure	🚪	cri	\N	\N	\N	\N	\N	1	\N	20	2026-01-01 06:42:48.132	2026-01-01 06:42:48.132	AVAILABLE
cmjv2vse20019uwtx288jwypg	Laboratories	Infrastructure	🧪	cri	\N	\N	\N	\N	\N	1	\N	5	2026-01-01 06:42:48.314	2026-01-01 06:42:48.314	AVAILABLE
cmjv2vsj5001auwtxdsm7be43	Total Officers	Human Resource	from-blue-500 to-cyan-400	cri	\N	\N	\N	\N	\N	1	\N	18	2026-01-01 06:42:48.497	2026-01-01 06:42:48.497	AVAILABLE
cmjv2vso7001buwtxuih5fmwd	Officials & Field Staff	Human Resource	from-indigo-500 to-purple-400	cri	\N	\N	\N	\N	\N	1	\N	32	2026-01-01 06:42:48.679	2026-01-01 06:42:48.679	AVAILABLE
cmjv2vst9001cuwtx66mldgvc	Total Positions	Human Resource	from-violet-600 to-fuchsia-400	cri	\N	\N	\N	\N	\N	1	\N	50	2026-01-01 06:42:48.861	2026-01-01 06:42:48.861	AVAILABLE
cmjv2vsyc001duwtxtnr2bvy1	Vacant Officer Positions	Human Resource	from-rose-500 to-orange-400	cri	\N	\N	\N	\N	\N	1	\N	4	2026-01-01 06:42:49.044	2026-01-01 06:42:49.044	AVAILABLE
\.


--
-- Data for Name: ERSSStockRegister; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ERSSStockRegister" ("id", "name", "type", "imageUrl", "departmentId", "quantityStr", "dateReceived", "lastVerificationDate", "currentStatusRemarks", "createdAt", "updatedAt", "status") FROM stdin;
\.


--
-- Data for Name: Equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Equipment" ("id", "name", "type", "status", "purchaseDate", "imageUrl", "departmentId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FloricultureStationAssets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."FloricultureStationAssets" ("id", "name", "type", "imageUrl", "departmentId", "category", "itemNameOrPost", "bpsScale", "sanctionedQty", "inPositionQty", "detailsOrArea", "createdAt", "updatedAt", "status") FROM stdin;
cmj65p9no0001fstxzsbc1zbc	Cultivated Area	Resource	\N	flori	Land	\N	\N	\N	\N	6.5	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0004fstx54o8d0t3	Power Sprayer	Equipment	\N	flori	Farm Machinery	\N	\N	1	\N	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0005fstxr1i77dmq	Brush Cutter	Equipment	\N	flori	Farm Machinery	\N	\N	1	\N	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0006fstx4d8181j8	Mini Rotavator	Equipment	\N	flori	Farm Machinery	\N	\N	1	\N	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0007fstxsbo7d80p	Digital Balance	Equipment	\N	flori	Lab Equipment	\N	\N	1	\N	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0008fstxlf8tfpmn	Hydro Distillation Unit	Equipment	\N	flori	Lab Equipment	\N	\N	1	\N	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0009fstx9dzookdb	Assistant Horticulturist	Staff	\N	flori	Human Resources	Assistant Horticulturist	18	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000afstxl8wv4idu	Assistant Research Officer	Staff	\N	flori	Human Resources	Assistant Research Officer	17	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000bfstxnx4087hh	Senior Clerk	Staff	\N	flori	Human Resources	Senior Clerk	14	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000cfstx5r5uvqm9	Budder	Staff	\N	flori	Human Resources	Budder	8	2	2	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000dfstx5kmqus6w	Jeep Driver	Staff	\N	flori	Human Resources	Jeep Driver	6	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000efstxocoqvgs3	Tractor Driver	Staff	\N	flori	Human Resources	Tractor Driver	8	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000ffstxf88byavc	Mali	Staff	\N	flori	Human Resources	Mali	5	2	2	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000gfstxviapruev	Beldars	Staff	\N	flori	Human Resources	Beldars	1,4,5	7	7	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000hfstx27na79t4	Chowkidar	Staff	\N	flori	Human Resources	Chowkidar	2,1	2	2	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000ifstx8mhpyp7n	Naib Qasid	Staff	\N	flori	Human Resources	Naib Qasid	5	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no000jfstxqjacdvzh	Sweeper	Staff	\N	flori	Human Resources	Sweeper	2	1	1	\N	2025-12-14 20:07:28.369	2025-12-14 20:07:28.369	AVAILABLE
cmj65p9no0003fstxo8m1qc73	Administrative Office	Resource	\N	flori	Building		\N	\N	\N	3.5 marlah	2025-12-14 20:07:28.369	2025-12-19 17:55:48.735	AVAILABLE
\.


--
-- Data for Name: FoodAnalysisLabEquipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."FoodAnalysisLabEquipment" ("id", "name", "type", "imageUrl", "departmentId", "labSectionName", "roomNumber", "quantity", "focalPerson", "createdAt", "updatedAt", "status") FROM stdin;
cmjv591fh0000ootxmtlyyjw6	Kjeldhal Apparatus Digestion unit and Distillation unit	Analytical Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:05.789	2026-01-01 07:49:05.789	AVAILABLE
cmjv591kq0001ootxjdx31xbw	Water Activity meter	Analytical Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:05.978	2026-01-01 07:49:05.978	AVAILABLE
cmjv591q30002ootxvzc467hu	Soxhlet Apparatus	Analytical Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:06.171	2026-01-01 07:49:06.171	AVAILABLE
cmjv591v80003ootxmo0rk4f5	Analytical Weighing Balance	Analytical Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:06.356	2026-01-01 07:49:06.356	AVAILABLE
cmjv592090004ootxzqojnqvt	Autoclave	Sterilization Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:06.537	2026-01-01 07:49:06.537	AVAILABLE
cmjv5925e0005ootxzby6bzno	Texture Analyzer	Testing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:06.722	2026-01-01 07:49:06.722	AVAILABLE
cmjv592ah0006ootxdp15yvsw	Freeze Dryer	Processing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:06.905	2026-01-01 07:49:06.905	AVAILABLE
cmjv592fl0007ootxbnjn4g3s	Pulse Electric Field	Processing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:07.089	2026-01-01 07:49:07.089	AVAILABLE
cmjv592ko0008ootxoae41nmg	Ozonation chamber	Processing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:07.272	2026-01-01 07:49:07.272	AVAILABLE
cmjv592pw0009ootxisb8i3hp	Pasteurizer	Processing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:07.46	2026-01-01 07:49:07.46	AVAILABLE
cmjv592uz000aootxoynisqnt	Fermenter	Processing Equipment	\N	food-science	Value Addition and Food Analysis Lab	127	1	Dr. Shabbir Ahmad	2026-01-01 07:49:07.643	2026-01-01 07:49:07.643	AVAILABLE
cmjv59309000bootx6hirwm48	Kjeldhal Apparatus	Analytical Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:07.833	2026-01-01 07:49:07.833	AVAILABLE
cmjv5935b000cootxpsntlz22	Digestion unit and Distillation unit	Analytical Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.015	2026-01-01 07:49:08.015	AVAILABLE
cmjv593af000dootx9je6e39r	Moisture Analyzer	Analytical Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.199	2026-01-01 07:49:08.199	AVAILABLE
cmjv593fh000eootxijmydq9z	Soxhlet Apparatus	Analytical Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.381	2026-01-01 07:49:08.381	AVAILABLE
cmjv593kj000footx49o3bco5	Analytical Weighing Balance	Analytical Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.563	2026-01-01 07:49:08.563	AVAILABLE
cmjv593pk000gootx87ahw67i	Muffle Furnace	Heating Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.744	2026-01-01 07:49:08.744	AVAILABLE
cmjv593ul000hootxfrtglapl	Viscometer	Testing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:08.925	2026-01-01 07:49:08.925	AVAILABLE
cmjv593zz000iootxlwh6s9sx	Farinograph	Testing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:09.119	2026-01-01 07:49:09.119	AVAILABLE
cmjv59451000jootxy7mnaja0	Fume Hood	Safety Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:09.301	2026-01-01 07:49:09.301	AVAILABLE
cmjv594a4000kootx1v81upb6	Desiccator	Storage Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:09.484	2026-01-01 07:49:09.484	AVAILABLE
cmjv594fa000lootxtawhbwgy	Gerber machine	Testing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:09.67	2026-01-01 07:49:09.67	AVAILABLE
cmjv594kd000mootxlty9w0f7	Rose head machine	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:09.853	2026-01-01 07:49:09.853	AVAILABLE
cmjv594pr000nootx3l4r0rwi	Abrasive peeler	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.047	2026-01-01 07:49:10.047	AVAILABLE
cmjv594uu000oootx96j9j7n1	Refrigerator	Storage Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.23	2026-01-01 07:49:10.23	AVAILABLE
cmjv594zw000pootxcy2hopdc	China Chakki	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.412	2026-01-01 07:49:10.412	AVAILABLE
cmjv5954z000qootx3nnm7uth	Grinder	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.595	2026-01-01 07:49:10.595	AVAILABLE
cmjv595a0000rootxfifq5gyy	Cheese press	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.776	2026-01-01 07:49:10.776	AVAILABLE
cmjv595f1000sootxv8if7m3e	Cheese vat	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:10.957	2026-01-01 07:49:10.957	AVAILABLE
cmjv595k2000tootxszm795m6	Cream separator	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:11.138	2026-01-01 07:49:11.138	AVAILABLE
cmjv595p3000uootxgg8jh0w3	Butter churner	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:11.319	2026-01-01 07:49:11.319	AVAILABLE
cmjv595u3000vootxkannt5tk	Flaker	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:11.499	2026-01-01 07:49:11.499	AVAILABLE
cmjv595zd000wootxwtp9xs83	Dough Mixer	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:11.689	2026-01-01 07:49:11.689	AVAILABLE
cmjv5964g000xootxb6lzqe2h	Dough Shitter	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:11.872	2026-01-01 07:49:11.872	AVAILABLE
cmjv5969p000yootxtm72ubex	Ice cream machine	Processing Equipment	\N	food-science	Nutrient Analytical & Food Processing Lab	114-115	1	Dr. Shabbir Ahmad	2026-01-01 07:49:12.061	2026-01-01 07:49:12.061	AVAILABLE
\.


--
-- Data for Name: MNSUAMEstateFacilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."MNSUAMEstateFacilities" ("id", "name", "type", "imageUrl", "departmentId", "blockName", "facilityType", "capacityPersons", "capacityLabel", "displayOrder", "createdAt", "updatedAt", "status") FROM stdin;
cmj65oz1j00008otxrq80ddwl	Syndicate Hall for meeting	Estate Facility	\N	mnsuam	Admin Block	Meeting Hall	50	50 persons	1	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1j00018otxmz1g9euy	Committee Room for meeting	Estate Facility	\N	mnsuam	Admin Block	Meeting Room	20	20 persons	2	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1j00028otx4qr5d2k5	Lecture Hall 110	Estate Facility	\N	mnsuam	Academic Block	Lecture Hall	150	150 persons	3	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1j00038otxh172hsbk	Lecture Hall 132	Estate Facility	\N	mnsuam	Academic Block	Lecture Hall	96	96 persons	4	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1k00048otxwzmg4rhh	Computer Lab	Estate Facility	\N	mnsuam	Academic Block	Computer Lab	\N	05 Labs	5	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1k00058otx5zmtab30	Training Hall	Estate Facility	\N	mnsuam	S.T.I. Library	Training Hall	40	40 persons (extendable to 80)	6	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1k00068otxf2hp18ez	Meeting Room	Estate Facility	\N	mnsuam	Genome Centre / UNESCO Chair	Meeting Room	15	15 persons	7	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1l00078otx9qp2p3ns	Sybrid Hall for training	Estate Facility	\N	mnsuam	Graduate Block / A block	Training Hall	30	30 persons	8	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1l00088otxu5h8n6wr	Executive Hall-I	Estate Facility	\N	mnsuam	Graduate Block / A block	Meeting Hall	35	35 persons	9	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1l00098otx6d0hsh2x	Lecture Hall	Estate Facility	\N	mnsuam	Graduate Block / A block	Lecture Hall	35	35 persons	10	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1l000a8otxiswl8egs	ORIC Meeting Hall	Estate Facility	\N	mnsuam	Graduate Block / A block	Meeting Hall	30	30 persons	11	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
cmj65oz1m000b8otxoxyi42d9	QEC Meeting Hall	Estate Facility	\N	mnsuam	Graduate Block / A block	Meeting Hall	12	12 persons	12	2025-12-14 20:07:14.613	2025-12-14 20:07:14.613	AVAILABLE
\.


--
-- Data for Name: MRIAssets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."MRIAssets" ("id", "name", "type", "imageUrl", "departmentId", "category", "itemNameOrDesignation", "bpsScale", "totalQuantityOrPosts", "filledOrFunctional", "vacantOrNonFunctional", "remarksOrLocation", "createdAt", "updatedAt", "status") FROM stdin;
cmj65ohdu0000z4txwm8q5nm1	Office	Resource	\N	mri	Land	\N	\N	\N	\N	\N	9 Acre	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdv0001z4txfbrtplda	Roads & Buildings	Resource	\N	mri	Land	\N	\N	\N	\N	\N	23 Acre	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdv0002z4tx1l0cr4qw	Direct Cultivated Area	Resource	\N	mri	Land	\N	\N	\N	\N	\N	32 Acre	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdv0003z4tx7nqa8jwv	Total Area	Resource	\N	mri	Land	\N	\N	\N	\N	\N	64 Acre	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdv0004z4txq70pin4e	Building Area	Resource	\N	mri	Building	\N	\N	\N	\N	\N	4 Acres	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0005z4tx60e1rovs	Rooms	Resource	\N	mri	Building	\N	\N	39	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0008z4txtu2a1b9a	Tractor	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0009z4txa7k9mevi	Tractor Trolley	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000az4tx5gu832cp	Cultivator	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000bz4txr1ew8vsj	Rotavator	Equipment	\N	mri	Farm Machinery	\N	\N	2	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000cz4tx15tjjxve	Weeds slasher	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000dz4txgafijfi4	Air Blast Sprayer	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000ez4txr9qd1pow	Nozel Sprayer	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000fz4txzhy4ne1l	Water Bowser	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000gz4tx5cpddvvq	Border Disc	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000hz4txya5n1cck	Electric Lawn Mower	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000iz4txqxl1egnx	Manual Lawn Mower	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000jz4tx19i0964r	Soil Rotary Tiller	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000kz4txuq8fnya3	Rear Blade	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000lz4txa18j0qa2	Hedge Cutter	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000mz4txp9mp3ubb	Trench	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000nz4txca7l6igp	Post Hole Digger	Equipment	\N	mri	Farm Machinery	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000oz4txchwx5xme	Vehicles	Equipment	\N	mri	Farm Machinery	\N	\N	4	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000pz4txx6nol1br	Flamephotometer	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000qz4txls7fo9ap	Shaker	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000rz4txh58xs8gr	EC-Meter	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000sz4txmfyux77z	pH Meter	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000tz4txhxkuntkq	Digital Weight Balance	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000uz4txqnoob923	Analytical Balance	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000vz4tx37epqgzb	Hot Plate	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000wz4txrs4swe41	Grinder	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000xz4txks25jyv1	Oven	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000yz4txngryeljt	Magnetic Hot Plate	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw000zz4txehy623gh	Spectrophoto meter	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0010z4txrdv2oz9h	Muffal Furnace	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0011z4txznsxyz1y	Distilation Unit	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0012z4txajmauw61	Test tube shaker	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0013z4txhvkkq9nf	Autoclave	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0014z4txaxflmskf	Distillation unit	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0015z4txjdfwf65t	Sample grinder	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0016z4tx2kibrwer	pH meter	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0017z4txrwccz68a	EC meter	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0018z4txqrgj3p91	Ethylene generator	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0019z4tx9bq9v6xj	Digital balance	Equipment	\N	mri	Lab Equipment	\N	\N	2	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001az4txwjxf94i6	Digital burette	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001bz4tx3supmhzm	Digital Refractrometer	Equipment	\N	mri	Lab Equipment	\N	\N	2	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001cz4txfcdovozd	Hot water bath	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001dz4txij9i82we	Pulp blender	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001ez4txg7bdf6iu	NIR Case	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001fz4txpxg96piu	Hot air dryer	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001gz4txlm4jpksq	Incubator	Equipment	\N	mri	Lab Equipment	\N	\N	2	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001hz4tx4utqd11p	Small incubator	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001iz4txq5nkea1e	Laminar flow chamber	Equipment	\N	mri	Lab Equipment	\N	\N	2	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001jz4tx31ct7exn	Autoclave	Equipment	\N	mri	Lab Equipment	\N	\N	3	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001kz4tx6vt5blkw	Stereoscope	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001lz4tx7zw8qce9	Microscope	Equipment	\N	mri	Lab Equipment	\N	\N	3	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001mz4tx2tcrhy3b	Oven	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001nz4txpi914a9m	Oven	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0007z4tx0efr48sj	Women Washroom	Resource	\N	mri	Building		\N	1	\N	\N		2025-12-14 20:06:51.731	2025-12-18 14:17:24.83	AVAILABLE
cmj65ohdx001oz4tx8ekgkncp	Microtome	Equipment	\N	mri	Lab Equipment	\N	\N	1	\N	\N	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001pz4txjm9rfumg	Principal Scientist (Horticulture)/ Director	Staff	\N	mri	Human Resources	Principal Scientist (Horticulture)/ Director	19	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001qz4txkz6s53k5	Principal Scientist (Horticulture)	Staff	\N	mri	Human Resources	Principal Scientist (Horticulture)	19	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001rz4txv0uuvpmn	Prinicpal Scientist (Microbiology)	Staff	\N	mri	Human Resources	Prinicpal Scientist (Microbiology)	19	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001sz4txd8e3t60u	Principal Scientist (Plant Pathology)	Staff	\N	mri	Human Resources	Principal Scientist (Plant Pathology)	19	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001tz4txum3keien	Senior Scientist (Soil Science )	Staff	\N	mri	Human Resources	Senior Scientist (Soil Science )	18	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001uz4txyc2dbuo4	Senior Scientist(Entomology)	Staff	\N	mri	Human Resources	Senior Scientist(Entomology)	18	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001vz4tx5x71o0ce	Senior Scientist(Food Technology)	Staff	\N	mri	Human Resources	Senior Scientist(Food Technology)	18	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001wz4txm5fxwi5b	Senior Scientist Horticulture	Staff	\N	mri	Human Resources	Senior Scientist Horticulture	18	2	2	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001xz4txwggcntlf	Scientific Officer (Horticulture)	Staff	\N	mri	Human Resources	Scientific Officer (Horticulture)	17	3	2	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001yz4txfoj23m38	Scientific Officer (Plant Pathology)	Staff	\N	mri	Human Resources	Scientific Officer (Plant Pathology)	17	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx001zz4txosxge76v	Scientific Officer (Entomology)	Staff	\N	mri	Human Resources	Scientific Officer (Entomology)	17	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0020z4txgspqgirr	Scientific Officer (Post-harvest)	Staff	\N	mri	Human Resources	Scientific Officer (Post-harvest)	17	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0021z4txcukqsscu	Suprintendent	Staff	\N	mri	Human Resources	Suprintendent	17	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0022z4txzntwpdko	ASSISTANT	Staff	\N	mri	Human Resources	ASSISTANT	16	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0023z4txwvvcg8cm	Stenographer	Staff	\N	mri	Human Resources	Stenographer	15	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0024z4tx0khqxfi1	Senior Clerk	Staff	\N	mri	Human Resources	Senior Clerk	14	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0025z4txxz6c3u3v	Field Assistant	Staff	\N	mri	Human Resources	Field Assistant	11	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0026z4txz8saaz5t	Junior Clerk	Staff	\N	mri	Human Resources	Junior Clerk	11	2	1	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0027z4txjulm5p8a	Laboratory Assistant	Staff	\N	mri	Human Resources	Laboratory Assistant	6	3	1	2	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0028z4txxcylu1me	Budder	Staff	\N	mri	Human Resources	Budder	5	4	0	4	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdx0029z4txrt4avtnv	Tractor Driver	Staff	\N	mri	Human Resources	Tractor Driver	5	1	0	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002az4tx89tdwozu	Vehicle Driver	Staff	\N	mri	Human Resources	Vehicle Driver	5	2	2	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002bz4txsgbxpehj	Turbine Operator	Staff	\N	mri	Human Resources	Turbine Operator	3	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002cz4txiavxkoyk	Beldar	Staff	\N	mri	Human Resources	Beldar	1	6	5	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002dz4txku8liqbf	Chowkidar	Staff	\N	mri	Human Resources	Chowkidar	1	6	6	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002ez4tx1ts55ken	Laboratory Attendant	Staff	\N	mri	Human Resources	Laboratory Attendant	1	3	2	1	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002fz4txsnf7yk97	Naib Qasid	Staff	\N	mri	Human Resources	Naib Qasid	1	2	2	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdy002gz4txguwnyvo2	Sweeper	Staff	\N	mri	Human Resources	Sweeper	1	1	1	0	\N	2025-12-14 20:06:51.731	2025-12-14 20:06:51.731	AVAILABLE
cmj65ohdw0006z4txnop5tjht	Men Washroom	Resource	\N	mri	Building		\N	2	\N	\N		2025-12-14 20:06:51.731	2025-12-18 14:17:00.079	AVAILABLE
\.


--
-- Data for Name: MaintenanceLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."MaintenanceLog" ("id", "equipmentId", "date", "cost", "description", "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."User" ("id", "name", "email", "password", "role", "departmentId", "createdAt", "updatedAt", "image") FROM stdin;
cmjv1oftl0000swtx19ao3s0t	Cotton Research Institute Focal Person	dircrimm@gmail.com	$2b$10$0OwimfoDC3Va0rLkxsr/yuy1gTxmOpu0Qmm85TNj2nccchXSROcNe	DEPT_HEAD	cri	2026-01-01 06:09:05.816	2026-01-01 06:52:00.544	\N
cmjv76p5l0000hotxcajm1ygk	AMRI Focal Person	focalperson@amri.gov.pk	$2b$10$26.YVlzgsUJERVSY4YQBpOHYkv6Wiv5N1XM6YYb4c1NqTt.Q7IF0K	DEPT_HEAD	amri	2026-01-01 08:43:15.801	2026-01-01 09:17:20.996	\N
cmje7r3sk000008txbog9qfy9	RARI Focal Person	example1@example.com	$2b$10$1FNSk7phwCRBoLUF9K4ITOYsRPxMhRVb/GHJwnu4dApvpvyU0LUgS	DEPT_HEAD	rari	2025-12-20 11:26:58.38	2025-12-20 11:26:58.38	\N
cmje8gmda0000ystx4pusrit4	Agricultural Mechanical Research Institute	amri@example.com	$2b$10$xEXJsVYwguDl0zfX3ZhhJuKrhb1mIw06luREL/yDfbj4c4OF24xgO	DEPT_HEAD	amri	2025-12-20 11:46:51.881	2025-12-20 11:46:51.881	\N
cmjbhcf1k0000nwtx73n7fyyv	MRI Department Focal Person	abidhameedkhan@yahoo.com	$2b$10$rmadEB6C.4gJqcgFHUSo1ObLq0aTE7URMm0j9ElNBRkHmfmzSRQki	DEPT_HEAD	mri	2025-12-18 13:32:13.956	2026-01-01 06:53:00.88	\N
cmjv2j8pe00008otxljmfj596	Fahad Majeed	Raedcvehari@hitmail.com	$2b$10$3xVc1K2QesKjqKTTq2yDreZXymHRfHjo1dlhxltB7LEIKrNsNhA3C	DEPT_HEAD	raedc	2026-01-01 06:33:02.93	2026-01-01 09:19:06.094	\N
cmjbrqm1q0000dstxoirwwgby	Floriculture Focal Person	muzamil.ijaz243@gmail.com	$2b$10$jKIbuGViRGNcYvAm7yInGOf/CCDtcE1acTnrGEByw0gHgAy215LZW	DEPT_HEAD	flori	2025-12-18 18:23:11.9	2026-01-01 06:53:46.226	\N
cmjv2jt4v00003ctx3ykv0nrv	Soil & Water Testing Lab Focal Person	swt_mltn@yahoo.com	$2b$10$PzfTYVNL5DSV7ni4DeCCS.Amzc..E3jzdGtHNoyVrmV713sTFgL7S	DEPT_HEAD	soil-water	2026-01-01 06:33:29.407	2026-01-01 06:54:21.567	\N
cmjv2isrx0000kotxyvo3dx7u	Pesticide QC Lab Focal Person	sd96850@gmail.com	$2b$10$/z9ppu6TKfOajh0kkU0u6.cVhNUpX8C1vFnneatXCEnRzDN4QhqKq	DEPT_HEAD	pest	2026-01-01 06:32:42.285	2026-01-01 06:54:35.967	\N
cmjd7zkxx0000i8txyfej9xrr	Agri Extension Wing Focal Person	ext@agripunjab.gov.pk	$2b$10$hsJLJLTiXK7Nq83bO.vLpuHNprQCrxdQZXBB2EIcvOFcs1r2Y0Qjy	DEPT_HEAD	agri-ext	2025-12-19 18:45:51.842	2026-01-01 06:55:05.476	\N
cmjbr7u1t0000t4txdaq2w127	Agriculture Engineering Field Wing Focal Person	daemultan@yahoo.com	$2b$10$/qGei5Od569mAKn5/8ZCE.UpBk0EijEPKa9ZRT7k28f6e3S5N9.gK	DEPT_HEAD	agri-eng	2025-12-18 18:08:35.736	2026-01-01 06:55:20.215	\N
cmjv2h51v0000ngtxaq4shgk5	Entomology Research Sub-Station Focal Person	asifa_hameed_sheikh@yahoo.com	$2b$10$rADqSe8FqAr71/5H0CBwX.j2s83Ogb6kNQwchDp/goQcbF.Ajpkme	DEPT_HEAD	erss	2026-01-01 06:31:24.882	2026-01-01 06:55:34.663	\N
cmjv2ho0g0000xctxmblfkucg	Food Science and Technology Focal Person	shabbir.ahmad@mnsuam.edu.pk	$2b$10$ylkQ54pgL0jDebq.c6Uq.uUR.exlGC9vnDCJ0b88QA9dNZT48YUFO	DEPT_HEAD	food-science	2026-01-01 06:31:49.455	2026-01-01 07:45:21.574	\N
cmjv670lx0000rstx3l5rel13	Adaptive Research Center Focal Person	arc@agripunjab.gov.pk	$2b$10$.iy9U1D86HifTfXojuLIx.wfLwJtGigMkuTdMR1fl81vGDR1NGahW	DEPT_HEAD	arc	2026-01-01 08:15:31.028	2026-01-01 08:15:31.028	\N
cmjv6it660000n0txwwmnq2ld	Dr. Nabeel Ahmad Ikram	nabeel.ahmad@mnsuam.edu.pk	$2b$10$iKV8RYiyIayak.btqLY0EOii84VhVcM4c0z44xADQS/Svhocpi8ua	DEPT_HEAD	agronomy	2026-01-01 08:24:41.261	2026-01-01 08:24:41.261	\N
cmje8405y00007ktxr8fp9t9p	RARI Focal Person	rari@example.com	$2b$10$a94i7ZANc0tqpWxX6GQX5uean7HYnXuw4A/X3fT9Wv3.fZaamxutS	DEPT_HEAD	rari	2025-12-20 11:37:03.443	2026-01-01 08:48:53.149	\N
cmjv2i81c0000fwtxnvz3tjl1	Muhammad Nawaz Shareef University Focal Person	estatedata.focalperson@mnsuam.edu.pk	$2b$10$Zam1xbuSMBex0Krkp7S7veJ7VCO0fbVsP/y0OYMBAmdOlmCAZcRFO	DEPT_HEAD	mnsuam	2026-01-01 06:32:15.408	2026-01-18 09:46:30.244	\N
cmjv7hdgq000084tx9goy8qv1	Mr. Naeem Arshad Maan	naeemmaan@gmail.com	$2b$10$sz3fxxWLQB/wdFGbtiZ4ZuwIraPfIE0MsBevpG5Apz.37L0pEsX0a	DEPT_HEAD	rari	2026-01-01 08:51:33.865	2026-01-01 09:13:03.049	\N
cmkww2c7j000004l7gny1eodb	Muhammad Moeen 	mianmoeen3610@gmail.com	$2b$10$hh.ZX02/hfZ/nHAfpKlmG.8CiGj4vKzLffTCEm9EpzOdOGAVjCu5.	DEPT_HEAD	food-science	2026-01-27 17:47:11.311	2026-01-27 17:47:11.311	\N
cmkwykg1i000004joakwedqd6	working home	iug@gmail.com	$2b$10$9/JyOObvUDUa7ljj9BRQ0Om1p9jziDPbx/3F55VDJPVra72nRwkiO	DEPT_HEAD	flori	2026-01-27 18:57:15.318	2026-01-27 18:57:15.318	\N
cmmf6jni10000txucqlel0f37	Super Admin	superadmin@raf-sp.gov.pk	$2b$10$QUdBblGBTF9tI9LliEall.8otIsydVZufXt3seBg/oJfRVAbLAhEe	SUPER_ADMIN	\N	2026-03-06 17:40:08.759	2026-03-06 17:40:08.759	\N
\.


--
-- Data for Name: ResourceRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ResourceRequest" ("id", "resourceType", "resourceId", "resourceName", "requestingDeptId", "lendingDeptId", "requestedById", "requestReason", "status", "reviewedById", "reviewedAt", "rejectionReason", "borrowDurationDays", "borrowStartDate", "borrowEndDate", "actualReturnDate", "createdAt", "updatedAt", "expiresAt") FROM stdin;
cml0ie6vl0001txesz7xilwn0	FoodAnalysisLabEquipment	cmjv591q30002ootxvzc467hu	Soxhlet Apparatus	agri-eng	food-science	cmjbr7u1t0000t4txdaq2w127	We nee this really asap	PENDING	\N	\N	\N	\N	\N	\N	\N	2026-01-30 06:35:34.345	2026-01-30 06:35:34.345	2026-02-14 06:35:34.289
cmljs9cg20001jp04nvbwutme	CRIMultanAssets	cmjv2vpp0000quwtxm8ja8j5g	Boom Sprayer	mnsuam	cri	cmjv2i81c0000fwtxnvz3tjl1	This is for testing purposes	REJECTED	cmjv1oftl0000swtx19ao3s0t	2026-02-12 18:20:07.865	tests	\N	\N	\N	\N	2026-02-12 18:19:21.795	2026-02-12 18:20:07.866	2026-02-27 18:19:21.793
cmm07isgp0001l104e31xtnhl	MRIAssets	cmj65ohdw000az4tx5gu832cp	Cultivator	agri-eng	mri	cmjbr7u1t0000t4txdaq2w127		PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-24 06:10:55.513	2026-02-24 06:10:55.513	2026-03-11 06:10:55.512
cmm07mgc10007l1046l83fpa2	MNSUAMEstateFacilities	cmj65oz1l00088otxu5h8n6wr	Executive Hall-I	agri-eng	mnsuam	cmjbr7u1t0000t4txdaq2w127		PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-24 06:13:46.417	2026-02-24 06:13:46.417	2026-03-11 06:13:46.416
cmm07x1sr000dl104402zbvan	AgriculturalExtensionWing	cmjv36po600020otxs8xu0crz	Office of the Assistant Director Agriculture (Ext)	agri-eng	agri-ext	cmjbr7u1t0000t4txdaq2w127	AMSCD	REJECTED	cmjd7zkxx0000i8txyfej9xrr	2026-02-24 06:25:05.635	currently unavailable.	\N	\N	\N	\N	2026-02-24 06:22:00.796	2026-02-24 06:25:05.636	2026-03-11 06:22:00.795
cmm0cmml70001lb04fnr465dj	AgriculturalExtensionWing	cmjv36phq00010otxd6ifue23	SAO / EADA	agri-eng	agri-ext	cmjbr7u1t0000t4txdaq2w127	15 days	REJECTED	cmjd7zkxx0000i8txyfej9xrr	2026-02-24 08:52:33.611	unavailability	\N	\N	\N	\N	2026-02-24 08:33:52.603	2026-02-24 08:52:33.612	2026-03-11 08:33:52.602
cmm0dgeoi0001ju041i5gw2no	AgriculturalExtensionWing	cmjv36phq00010otxd6ifue23	SAO / EADA	agri-eng	agri-ext	cmjbr7u1t0000t4txdaq2w127	15 days	PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-24 08:57:02.035	2026-02-24 08:57:02.035	2026-03-11 08:57:02.034
cmm1mzo9e0001l204g34nbomg	AgriEngineeringMultanRegionData	cmjv3720q0003e4txwevx5m58	Director Agricultural Engineering Bahawalpur	agri-ext	agri-eng	cmjd7zkxx0000i8txyfej9xrr	need resource for 20 days starting from 25/02/2026	PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-25 06:11:43.635	2026-02-25 06:11:43.635	2026-03-12 06:11:43.634
cmm1n3vqr0001jv04t1wgwxi4	AgriEngineeringMultanRegionData	cmjv371vt0002e4tx0f1t4oi5	Assistant Director Agriculturla Engineering Vehari	agri-ext	agri-eng	cmjd7zkxx0000i8txyfej9xrr	need resource for 20 days from 25/02/2026	PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-25 06:14:59.955	2026-02-25 06:14:59.955	2026-03-12 06:14:59.954
cmm1n9t9f0007jv04tqx4t0d3	AgriEngineeringMultanRegionData	cmjv3725s0004e4txw4p9gtsj	Director Agricultural Engineering (Training Bahawalpur)	agri-ext	agri-eng	cmjd7zkxx0000i8txyfej9xrr	type here.	PENDING	\N	\N	\N	\N	\N	\N	\N	2026-02-25 06:19:36.675	2026-02-25 06:19:36.675	2026-03-12 06:19:36.674
cmljs6i9i0001if04ed1ndjvj	CRIMultanAssets	cmjv2vmab0003uwtxdpug7ygj	HPLC	mnsuam	cri	cmjv2i81c0000fwtxnvz3tjl1	This is just testing	OVERDUE	cmjv1oftl0000swtx19ao3s0t	2026-02-12 18:20:22.714	\N	10	2026-02-24 10:42:26.367	2026-03-06 10:42:26.367	\N	2026-02-12 18:17:09.367	2026-03-07 08:34:52.718	2026-02-27 18:17:09.365
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Notification" ("id", "userId", "type", "title", "message", "requestId", "read", "emailSent", "createdAt") FROM stdin;
cml0ie8dz0005txeswajm5o2z	cmjv2ho0g0000xctxmblfkucg	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "Soxhlet Apparatus" from your department.	cml0ie6vl0001txesz7xilwn0	f	f	2026-01-30 06:35:36.311
cmljs6jc20005if048m7dr7xs	cmjv1oftl0000swtx19ao3s0t	REQUEST_RECEIVED	New Resource Request	Muhammad Nawaz Shareef University of Agriculture has requested "HPLC" from your department.	cmljs6i9i0001if04ed1ndjvj	f	f	2026-02-12 18:17:10.754
cmljs9die0005jp04vtb1x38w	cmjv1oftl0000swtx19ao3s0t	REQUEST_RECEIVED	New Resource Request	Muhammad Nawaz Shareef University of Agriculture has requested "Boom Sprayer" from your department.	cmljs9cg20001jp04nvbwutme	f	f	2026-02-12 18:19:23.174
cmljsacvh0003jv04q3vw75is	cmjv2i81c0000fwtxnvz3tjl1	REQUEST_REJECTED	Request Rejected	Your request for "Boom Sprayer" was rejected. Reason: tests	cmljs9cg20001jp04nvbwutme	t	f	2026-02-12 18:20:09.005
cmljsaobs0007jv04esj15rz9	cmjv2i81c0000fwtxnvz3tjl1	REQUEST_APPROVED	Request Approved	Your request for "HPLC" has been approved for 10 days.	cmljs6i9i0001if04ed1ndjvj	t	f	2026-02-12 18:20:23.849
cmm07itjj0005l104ien3r3ie	cmjbhcf1k0000nwtx73n7fyyv	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "Cultivator" from your department.	cmm07isgp0001l104e31xtnhl	f	f	2026-02-24 06:10:56.911
cmm07mhcr000bl10456hg85ov	cmjv2i81c0000fwtxnvz3tjl1	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "Executive Hall-I" from your department.	cmm07mgc10007l1046l83fpa2	f	f	2026-02-24 06:13:47.74
cmm07x2tl000hl104zq54twag	cmjd7zkxx0000i8txyfej9xrr	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "Office of the Assistant Director Agriculture (Ext)" from your department.	cmm07x1sr000dl104402zbvan	f	f	2026-02-24 06:22:02.121
cmm0cmnmw0005lb047kinw4kx	cmjd7zkxx0000i8txyfej9xrr	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "SAO / EADA" from your department.	cmm0cmml70001lb04fnr465dj	f	f	2026-02-24 08:33:53.96
cmm0dgfq50005ju04inkzpz7v	cmjd7zkxx0000i8txyfej9xrr	REQUEST_RECEIVED	New Resource Request	Agriculture Engineering has requested "SAO / EADA" from your department.	cmm0dgeoi0001ju041i5gw2no	f	f	2026-02-24 08:57:03.389
cmm08118f0003jo049fp7x93c	cmjbr7u1t0000t4txdaq2w127	REQUEST_REJECTED	Request Rejected	Your request for "Office of the Assistant Director Agriculture (Ext)" was rejected. Reason: currently unavailable.	cmm07x1sr000dl104402zbvan	t	f	2026-02-24 06:25:06.688
cmm0daod00003lb04fovqftu6	cmjbr7u1t0000t4txdaq2w127	REQUEST_REJECTED	Request Rejected	Your request for "SAO / EADA" was rejected. Reason: unavailability	cmm0cmml70001lb04fnr465dj	t	f	2026-02-24 08:52:34.644
cmm0h7zmv0003l5049kqi715g	cmjv1oftl0000swtx19ao3s0t	BORROW_STARTED	Resource Borrowed	"HPLC" has been borrowed by Muhammad Nawaz Shareef University of Agriculture.	cmljs6i9i0001if04ed1ndjvj	f	f	2026-02-24 10:42:27.751
cmm1mzpcn0005l20467d392pn	cmjbr7u1t0000t4txdaq2w127	REQUEST_RECEIVED	New Resource Request	Agricultural Extension Wing has requested "Director Agricultural Engineering Bahawalpur" from your department.	cmm1mzo9e0001l204g34nbomg	f	f	2026-02-25 06:11:45.047
cmm1n3wsg0005jv04ixq7400z	cmjbr7u1t0000t4txdaq2w127	REQUEST_RECEIVED	New Resource Request	Agricultural Extension Wing has requested "Assistant Director Agriculturla Engineering Vehari" from your department.	cmm1n3vqr0001jv04t1wgwxi4	f	f	2026-02-25 06:15:01.312
cmm1n9uab000bjv04zn95tovc	cmjbr7u1t0000t4txdaq2w127	REQUEST_RECEIVED	New Resource Request	Agricultural Extension Wing has requested "Director Agricultural Engineering (Training Bahawalpur)" from your department.	cmm1n9t9f0007jv04tqx4t0d3	f	f	2026-02-25 06:19:38.003
cmmg2iafu0001l504n3qcidt1	cmjv2i81c0000fwtxnvz3tjl1	RESOURCE_OVERDUE	Resource Return Overdue	The borrow period for "HPLC" has ended. Please return it to Cotton Research Institute.	cmljs6i9i0001if04ed1ndjvj	f	t	2026-03-07 08:34:52.89
\.


--
-- Data for Name: PageView; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."PageView" ("id", "page", "departmentId", "userId", "createdAt") FROM stdin;
cmn4kw3by0000k4047u2nw4ju	/dashboard/mnsuam	mnsuam	cmjv2i81c0000fwtxnvz3tjl1	2026-03-24 12:15:58.175
cmn4m1hw40001tx8obtrl7v8a	/departments/amri	amri	cmmf6jni10000txucqlel0f37	2026-03-24 12:48:09.941
cmn4m1hvs0000tx8oajng71xb	/departments/soil-water	soil-water	cmmf6jni10000txucqlel0f37	2026-03-24 12:48:09.927
cmn4m5f0d0002tx8od9f4uymj	/departments/soil-water	soil-water	cmmf6jni10000txucqlel0f37	2026-03-24 12:51:12.83
cmn4m877l0003tx8oma64cjdq	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:53:22.69
cmn4majpk0004tx8oam885ds3	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:55:12.2
cmn4mapjr0005tx8o6b56b9o6	/dashboard/super-admin/department-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:55:19.768
cmn4matw70006tx8ojqiglvki	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:55:25.399
cmn4mavut0007tx8op9t8o4bg	/dashboard/super-admin/department-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:55:27.942
cmn4mbv480008tx8odm78qx3a	/dashboard/super-admin/department-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:56:13.641
cmn4mc3cn0009tx8op0satxhe	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:56:24.311
cmn4mf7ol000atx8opbttgv9s	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:58:49.893
cmn4mffm3000btx8ozrv5r30o	/dashboard/super-admin/department-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:59:00.172
cmn4mfptu000ctx8oyfdn4d54	/dashboard/super-admin/admin-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:59:13.411
cmn4mfwd8000dtx8o8oxtyye4	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 12:59:21.884
cmn4mi5t9000etx8okfa5s2o0	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:07.437
cmn4mibac000ftx8oq0r0clqu	/dashboard/super-admin/department-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:14.532
cmn4midpz000gtx8o35b4u10m	/dashboard/super-admin/admin-views	\N	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:17.687
cmn4migdm000htx8odpat3k2h	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:21.131
cmn4mikvc000itx8octiidivc	/departments/ento	ento	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:26.953
cmn4mixfh000jtx8orlx9somx	/dashboard/super-admin	\N	cmmf6jni10000txucqlel0f37	2026-03-24 13:01:43.23
\.


--
-- Data for Name: PesticideQCLabData; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."PesticideQCLabData" ("id", "name", "type", "status", "imageUrl", "departmentId", "sectionCategory", "bpsScale", "quantityOrSanctioned", "createdAt", "updatedAt") FROM stdin;
cmj65o6hr0000rctx18nn5h6k	Chief Scientist Office	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hs0001rctx6tzc7sc2	Establishment Office	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hs0002rctxkexw2ygp	ISO Cell	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hs0003rctxqmf3luen	General Laboratory	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hs0004rctxabb77tgq	HPLC Lab-1	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu0005rctxr1ctm2b4	HPLC Lab-2	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu0006rctx5v8zv0uk	GC Laboratory	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu0007rctxy01y341h	Sample Processing Room	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu0008rctxehvoe46d	Chemical Laboratory	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu0009rctxkz1xowao	Balance Room	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu000arctx6w3m88wr	Sample Store Room	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu000brctxvvcteh3r	Sample Receiving Room	Building	AVAILABLE	🏢	pest	Facility	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu000crctx278qy961	HPLC	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	3	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu000drctxm01t0pus	GC	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hu000erctxax1tq9wf	Analytical Balance	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000frctxr6v7xux0	Spectrophotometer	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000grctx3x3er88b	EC Meter	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000hrctxl8gkjeke	Thermo Hygrometer	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	4	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000irctxyjq3vc65	pH Meter	Lab Equipment	AVAILABLE	🧪	pest	Instrument	\N	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000jrctxi7r005u5	Chief Scientist	Human Resource	AVAILABLE	📋	pest	Sanctioned	20	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000krctxi8jr0iuw	Chief Scientist	Human Resource	AVAILABLE	✅	pest	Filled	20	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000lrctxat0gyvhf	Chief Scientist	Human Resource	AVAILABLE	⚪	pest	Vacant	20	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000mrctxe7vlmdwk	Principal Scientist	Human Resource	AVAILABLE	📋	pest	Sanctioned	19	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000nrctxkt2tm1zu	Principal Scientist	Human Resource	AVAILABLE	✅	pest	Filled	19	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000orctxmj88adbk	Principal Scientist	Human Resource	AVAILABLE	⚪	pest	Vacant	19	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000prctxwczto2sw	Senior Scientist	Human Resource	AVAILABLE	📋	pest	Sanctioned	18	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000qrctxnamk6gdk	Senior Scientist	Human Resource	AVAILABLE	✅	pest	Filled	18	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000rrctxbdhhv83j	Senior Scientist	Human Resource	AVAILABLE	⚪	pest	Vacant	18	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000srctx2qlxifue	Scientific Officer	Human Resource	AVAILABLE	📋	pest	Sanctioned	17	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000trctxzgkwig7u	Scientific Officer	Human Resource	AVAILABLE	✅	pest	Filled	17	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000urctxu04a7wz8	Scientific Officer	Human Resource	AVAILABLE	⚪	pest	Vacant	17	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000vrctxgr1kdnj9	Stenographer	Human Resource	AVAILABLE	📋	pest	Sanctioned	16	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hv000wrctx3rakf21u	Stenographer	Human Resource	AVAILABLE	✅	pest	Filled	16	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw000xrctxds8umj0l	Stenographer	Human Resource	AVAILABLE	⚪	pest	Vacant	16	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw000yrctx6fwy8x1n	Research Assistant	Human Resource	AVAILABLE	📋	pest	Sanctioned	15	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw000zrctxo442y6al	Research Assistant	Human Resource	AVAILABLE	✅	pest	Filled	15	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0010rctxwmj1k6r6	Research Assistant	Human Resource	AVAILABLE	⚪	pest	Vacant	15	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0011rctxi6jwncwn	Senior Clerk	Human Resource	AVAILABLE	📋	pest	Sanctioned	14	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0012rctxgwbhm570	Senior Clerk	Human Resource	AVAILABLE	✅	pest	Filled	14	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0013rctx4nko0fse	Senior Clerk	Human Resource	AVAILABLE	⚪	pest	Vacant	14	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0014rctxce4fhda7	Junior Clerk	Human Resource	AVAILABLE	📋	pest	Sanctioned	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0015rctxsrdbq922	Junior Clerk	Human Resource	AVAILABLE	✅	pest	Filled	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0016rctxah8hgmin	Junior Clerk	Human Resource	AVAILABLE	⚪	pest	Vacant	11	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0017rctx51z34auz	Instrument Technician	Human Resource	AVAILABLE	📋	pest	Sanctioned	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0018rctxe9o8ni5h	Instrument Technician	Human Resource	AVAILABLE	✅	pest	Filled	11	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw0019rctxjzbnwdpa	Instrument Technician	Human Resource	AVAILABLE	⚪	pest	Vacant	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001arctxbtdyh1rx	Lab Technician	Human Resource	AVAILABLE	📋	pest	Sanctioned	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001brctxlb5uumen	Lab Technician	Human Resource	AVAILABLE	✅	pest	Filled	11	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001crctxykn88w4h	Lab Technician	Human Resource	AVAILABLE	⚪	pest	Vacant	11	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001drctx84tcupdx	Lab Assistant	Human Resource	AVAILABLE	📋	pest	Sanctioned	6	4	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001erctxdfhfon48	Lab Assistant	Human Resource	AVAILABLE	✅	pest	Filled	6	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hw001frctxgn18mcdg	Lab Assistant	Human Resource	AVAILABLE	⚪	pest	Vacant	6	4	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001grctxjkmmxq46	Driver	Human Resource	AVAILABLE	📋	pest	Sanctioned	4	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001hrctxozftyf4u	Driver	Human Resource	AVAILABLE	✅	pest	Filled	4	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001irctxd4az10k5	Driver	Human Resource	AVAILABLE	⚪	pest	Vacant	4	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001jrctxb9v9iqm3	Lab Attendant	Human Resource	AVAILABLE	📋	pest	Sanctioned	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001krctxsb5x7fbw	Lab Attendant	Human Resource	AVAILABLE	✅	pest	Filled	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001lrctx4fte010o	Lab Attendant	Human Resource	AVAILABLE	⚪	pest	Vacant	1	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001mrctxdr3q9a9k	Naib Qasid	Human Resource	AVAILABLE	📋	pest	Sanctioned	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001nrctx818if0r5	Naib Qasid	Human Resource	AVAILABLE	✅	pest	Filled	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001orctxjzn0rvaq	Naib Qasid	Human Resource	AVAILABLE	⚪	pest	Vacant	1	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001prctxzjz9cq0b	Chowkidar	Human Resource	AVAILABLE	📋	pest	Sanctioned	1	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001qrctx26zqa9wx	Chowkidar	Human Resource	AVAILABLE	✅	pest	Filled	1	2	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001rrctxe7ebvns9	Chowkidar	Human Resource	AVAILABLE	⚪	pest	Vacant	1	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001srctxt6utkp1a	Sweeper	Human Resource	AVAILABLE	📋	pest	Sanctioned	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001trctxpzbaqvbu	Sweeper	Human Resource	AVAILABLE	✅	pest	Filled	1	1	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
cmj65o6hx001urctxvqnbftfz	Sweeper	Human Resource	AVAILABLE	⚪	pest	Vacant	1	0	2025-12-14 20:06:37.611	2025-12-14 20:06:37.611
\.


--
-- Data for Name: RAEDCEquipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."RAEDCEquipment" ("id", "name", "type", "imageUrl", "departmentId", "facilityType", "capacity", "location", "functionality", "createdAt", "updatedAt", "status") FROM stdin;
cmjv36dc2000084txfcv80ojf	Training halls equipped with multimedia	Training Facility	\N	raedc	Training Halls	\N	RAEDC Vehari	Operational	2026-01-01 06:51:02.018	2026-01-01 06:51:02.018	AVAILABLE
cmjv36dh2000184tx6un22k13	Computer lab with capacity for 30–35 participants	Laboratory	\N	raedc	Computer Lab	35	RAEDC Vehari	Operational	2026-01-01 06:51:02.198	2026-01-01 06:51:02.198	AVAILABLE
cmjv36dlx000284tx8u686k9z	Library with agriculture and training resources	Library	\N	raedc	Library	\N	RAEDC Vehari	Operational	2026-01-01 06:51:02.373	2026-01-01 06:51:02.373	AVAILABLE
cmjv36dr1000384txbxbtckui	Auditorium accommodating approximately 300 participants	Auditorium	\N	raedc	Auditorium	300	RAEDC Vehari	Operational	2026-01-01 06:51:02.557	2026-01-01 06:51:02.557	AVAILABLE
cmjv36dvy000484tx9lcapovj	Demonstration farm used for hands-on training and technology demonstrations	Farm Facility	\N	raedc	Demonstration Farm	\N	RAEDC Vehari	Operational	2026-01-01 06:51:02.734	2026-01-01 06:51:02.734	AVAILABLE
\.


--
-- Data for Name: RARIBahawalpurAssets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."RARIBahawalpurAssets" ("id", "name", "type", "imageUrl", "departmentId", "category", "makeModelYear", "quantity", "conditionStatus", "useApplication", "createdAt", "updatedAt", "status") FROM stdin;
cmjv760y3000qu4tx91vui189	Power Sprayer Machine	Farm Machinery	\N	rari	\N	\N	7	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20000u4tx1jym2kzt	Total Area	Land	\N	rari	\N	\N	178	Acres	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20001u4tx7cun849l	Cultivated Area	Land	\N	rari	\N	\N	123	Acres	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20002u4txsnbwxpag	Roads/Building Area	Land	\N	rari	\N	\N	55	Acres	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20003u4txa8051zs3	Office Buildings	Building	\N	rari	\N	\N	5	Blocks	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20004u4tx293u02vi	Residential Quarters	Building	\N	rari	\N	\N	29	Units	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20005u4txazp55cm1	Produce Store/Shed	Building	\N	rari	\N	\N	1	Units	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20006u4tx19snjspq	Rabi Drill	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20007u4tx9hjit6w4	Cultivator 13 Phy	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20008u4txtuhlnbdj	Cultivator	Farm Machinery	\N	rari	\N	\N	3	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y20009u4tx8yesfv2f	Grass cuter Machine	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000au4tx8o4wsv1d	Water Tank	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000bu4tx8js5z02i	Thrasher	Farm Machinery	\N	rari	\N	\N	2	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000cu4tx394kj218	Full size Trolly	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000du4txawjcs9ty	Single plant Wheat Thrasher	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000eu4txr025notr	Disk 16 Tavy	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000fu4txoobuf9zf	Karah	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000gu4txgecnu7u7	Tractor Reaper	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000hu4txivc9su0p	Power Sprayer Machine	Farm Machinery	\N	rari	\N	\N	2	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000iu4txug6qhfng	Lawn roller	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000ju4tx90r1whv7	Ditcher	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000ku4txfh7f3i0u	Bottom plough	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y2000lu4txywn340xc	Disk plough	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000mu4txbq7vh1iq	Chisel plough	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000nu4txpqggjyhz	Disk plough	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000ou4txzsirqmxd	Wheat Thrasher	Farm Machinery	\N	rari	\N	\N	2	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000pu4txvqll4c19	Seed Grader	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000ru4txsvv8rqox	FIAT Dabang 85Hp, 2022	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000su4tx7196dzxj	FIAT tractor 75Hp, 1977	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000tu4txql0f97qx	Tractor, Massey-385, 85Hp, 2012	Farm Machinery	\N	rari	\N	\N	1	Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000uu4txzng8l2r7	Tractor Kabota, 30 Hp, 1995	Farm Machinery	\N	rari	\N	\N	1	Non Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000vu4txbvas0j5r	Tractor Kabota, 30 Hp,1995	Farm Machinery	\N	rari	\N	\N	1	Non Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000wu4txmw4sqkvc	Massy Fargosan 75 Hp, 2012	Farm Machinery	\N	rari	\N	\N	1	Non Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000xu4txcq20xf8k	FIAT  75Hp, 2004	Farm Machinery	\N	rari	\N	\N	1	Non Working	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000yu4txp5ruvctc	Top Loaded Balance	Lab Equipment	\N	rari	\N	\N	\N	Working	To Weight Soil Samples	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3000zu4txpbhxprvh	Water Bath Thermostatic	Lab Equipment	\N	rari	\N	\N	\N	Working	To Incubate Samples In Water At Constant Temperature	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30010u4txivjzsumd	Air Compressor	Lab Equipment	\N	rari	\N	\N	\N	Out Of Order	-	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30011u4txj9pz01gp	Shaker With Timer	Lab Equipment	\N	rari	\N	\N	\N	Working	To Shake And Mix Samples	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30012u4txeuo2xq7o	Muffle Furnace	Lab Equipment	\N	rari	\N	\N	\N	Working	Crashing The Samples To Determine Un Combustible Content	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30013u4tx6asy2m8l	Magnetic Sterr	Lab Equipment	\N	rari	\N	\N	\N	Working	To Mix Liquid	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30014u4txrutoesv2	Spectrophotometer	Lab Equipment	\N	rari	\N	\N	\N	Working	For Determination Of Phosphorus And Born In Soil	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30015u4txwatvsm10	Centrifuge	Lab Equipment	\N	rari	\N	\N	\N	Out Of Order	-	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30016u4txhmsg12i6	Flam Photometer	Lab Equipment	\N	rari	\N	\N	\N	Out Of Order	For Determination Of Potassium And Sodium	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30017u4tx1wgv0myx	Universal Shaking Apparatus	Lab Equipment	\N	rari	\N	\N	\N	Working	For Shaking And Mixing	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30018u4tx2vrgn5tm	Oven	Lab Equipment	\N	rari	\N	\N	\N	Working	Drying Of Samples And Sterilizing The Of Glass Ware	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30019u4txvkjqdfu0	Ph Meter Portable	Lab Equipment	\N	rari	\N	\N	\N	Working	To Determine The Ph Of Solution	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001au4tx99gawji3	Ph Meter Desktop	Lab Equipment	\N	rari	\N	\N	\N	Working	To Determine The Ph Of Solution	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001bu4tx2cq1t95m	EC Meter	Lab Equipment	\N	rari	\N	\N	\N	Working	To Check The Electrical Conductivity Of Solution	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001cu4txdx12h633	EC Meter	Lab Equipment	\N	rari	\N	\N	\N	Working	To Check The Electrical Conductivity Of Solution	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001du4txzc524lo0	Plant Grander	Lab Equipment	\N	rari	\N	\N	\N	Working	To Grind And Thresh The Plant And Grains	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001eu4txcei8x4st	Microscope	Lab Equipment	\N	rari	\N	\N	\N	Working	To Identify Micro Organisms	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001fu4txtlv3vlt7	Digital Balance	Lab Equipment	\N	rari	\N	\N	\N	Working	To Weight Chemicals For Experiments	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001gu4txyel4zc7y	Colony Counter	Lab Equipment	\N	rari	\N	\N	\N	Working	To Measure Microbial Colony	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001hu4tx99bakcyw	Humidifier	Lab Equipment	\N	rari	\N	\N	\N	Working	To Create Artificial Humidity For Experiments	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001iu4txd72bw3f0	Germination Cabinet	Lab Equipment	\N	rari	\N	\N	\N	Out Of Order	Grow Microbe Under Control Condition	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001ju4tx01xh61av	Microscope	Lab Equipment	\N	rari	\N	\N	\N	Working	To Identify Micro Organisms	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001ku4txz0arpn0a	Bio Incubator	Lab Equipment	\N	rari	\N	\N	\N	Working	Grow Microbe Under Control Condition	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001lu4txynl6jxsz	Electric Balance And Seed Counter	Lab Equipment	\N	rari	\N	\N	\N	Working	For Weight/Thousands Grain Weight And Counting	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001mu4txhpe4yq2e	Canopy Temperature Meter	Lab Equipment	\N	rari	\N	\N	\N	Working	To Observe The Crop Canopy Temperature	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001nu4tx61rq4cac	Digital Balance	Lab Equipment	\N	rari	\N	\N	\N	Working	For Weighting The Small Samples Of Plant Parts.	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001ou4tx3cemwvq1	Leaf Area Scanner/Meter	Lab Equipment	\N	rari	\N	\N	\N	Working	To Measure The Plant Leaf Area	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001pu4tx8171863v	Principal Scientist:	HR - Officers	\N	rari	BPS-19	\N	8	Filled: 01, Vacant: 07	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001qu4tx2ak2jcvj	Senior Scientist	HR - Officers	\N	rari	BPS-18	\N	12	Filled: 11, Vacant: 01	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001ru4txox1om2k2	Assistant	HR - Officials	\N	rari	BPS-16	\N	2	Filled: 2, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001su4txd31uq02y	Senior Scale Stenographer	HR - Officials	\N	rari	BPS-16	\N	1	Filled: 1, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001tu4txwkxamxlw	Stenographer	HR - Officials	\N	rari	BPS-15	\N	2	Filled: 1, Vacant: 1	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001uu4tx8nk0f85o	Senior Clerk	HR - Officials	\N	rari	BPS-14	\N	3	Filled: 3, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001vu4txklfluzrq	Junior Clerk	HR - Officials	\N	rari	BPS-11	\N	8	Filled: 6, Vacant: 2	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001wu4txzinu0her	Field Assistant	HR - Officials	\N	rari	BPS-11	\N	15	Filled: 1, Vacant: 14	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001xu4txvld8ieiv	Laboratory Assistant	HR - Officials	\N	rari	BPS-06	\N	5	Filled: 2, Vacant: 3	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001yu4txumxrwgvc	Tractor Driver	HR - Officials	\N	rari	BPS-05	\N	4	Filled: 2, Vacant: 2	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y3001zu4tx1r5j4eez	Budder	HR - Officials	\N	rari	BPS-05	\N	1	Filled: 1, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30020u4txgkaao9wg	Jeep Driver	HR - Officials	\N	rari	BPS-04	\N	4	Filled: 3, Vacant: 1	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30021u4txgcbllqxl	Tubewell Operator	HR - Officials	\N	rari	BPS-03	\N	2	Filled: 1, Vacant: 1	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30022u4txdkos34iw	Tube well Driver	HR - Officials	\N	rari	BPS-02	\N	1	Filled: 1, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30023u4txlprsmcru	Tractor Cleaner	HR - Officials	\N	rari	BPS-01	\N	2	Filled: 2, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30024u4tx0k3v6m61	Laboratory Attendant	HR - Officials	\N	rari	BPS-01	\N	4	Filled: 4, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30025u4txj8h2bex7	Mali	HR - Officials	\N	rari	BPS-01	\N	1	Filled: -, Vacant: 1	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30026u4tx1y8btz6i	Naib Qasid	HR - Officials	\N	rari	BPS-01	\N	11	Filled: 9, Vacant: 2	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30027u4txh7yxyfjm	Chowkidar	HR - Officials	\N	rari	BPS-01	\N	1	Filled: 1, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30028u4txo0e10t6x	Sweeper	HR - Officials	\N	rari	BPS-01	\N	2	Filled: 2, Vacant: -	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
cmjv760y30029u4txb7a4ac3h	Beldar	HR - Officials	\N	rari	BPS-01	\N	34	Filled: 25, Vacant: 9	\N	2026-01-01 08:42:44.245	2026-01-01 08:42:44.245	AVAILABLE
\.


--
-- Data for Name: RequestAuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."RequestAuditLog" ("id", "requestId", "action", "performedById", "previousStatus", "newStatus", "notes", "metadata", "createdAt") FROM stdin;
cml0ie8160003txesmthvzpib	cml0ie6vl0001txesz7xilwn0	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	We nee this really asap	\N	2026-01-30 06:35:35.85
cmljs6j3c0003if04h8n0vw1y	cmljs6i9i0001if04ed1ndjvj	CREATED	cmjv2i81c0000fwtxnvz3tjl1	\N	PENDING	This is just testing	\N	2026-02-12 18:17:10.44
cmljs9d9t0003jp04zre7zepr	cmljs9cg20001jp04nvbwutme	CREATED	cmjv2i81c0000fwtxnvz3tjl1	\N	PENDING	This is for testing purposes	\N	2026-02-12 18:19:22.865
cmljsacqw0001jv0441n9c8dl	cmljs9cg20001jp04nvbwutme	REJECTED	cmjv1oftl0000swtx19ao3s0t	PENDING	REJECTED	tests	\N	2026-02-12 18:20:08.841
cmljsao790005jv04v85e3xz1	cmljs6i9i0001if04ed1ndjvj	APPROVED	cmjv1oftl0000swtx19ao3s0t	PENDING	APPROVED	Approved for 10 days starting Thu Feb 12 2026	{"borrowEndDate": "2026-02-22T18:19:52.316Z", "borrowStartDate": "2026-02-12T18:19:52.316Z", "borrowDurationDays": 10}	2026-02-12 18:20:23.685
cmm07itat0003l104sghs02gx	cmm07isgp0001l104e31xtnhl	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	Request created	\N	2026-02-24 06:10:56.597
cmm07mh4j0009l104obgmcnx0	cmm07mgc10007l1046l83fpa2	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	Request created	\N	2026-02-24 06:13:47.444
cmm07x2lb000fl104w5xknwqw	cmm07x1sr000dl104402zbvan	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	AMSCD	\N	2026-02-24 06:22:01.823
cmm0811470001jo04ilfwy4qf	cmm07x1sr000dl104402zbvan	REJECTED	cmjd7zkxx0000i8txyfej9xrr	PENDING	REJECTED	currently unavailable.	\N	2026-02-24 06:25:06.536
cmm0cmneg0003lb04741blzo9	cmm0cmml70001lb04fnr465dj	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	15 days	\N	2026-02-24 08:33:53.656
cmm0dao8v0001lb04aruoghy8	cmm0cmml70001lb04fnr465dj	REJECTED	cmjd7zkxx0000i8txyfej9xrr	PENDING	REJECTED	unavailability	\N	2026-02-24 08:52:34.495
cmm0dgfho0003ju04j2cbbrww	cmm0dgeoi0001ju041i5gw2no	CREATED	cmjbr7u1t0000t4txdaq2w127	\N	PENDING	15 days	\N	2026-02-24 08:57:03.084
cmm0h7zec0001l504oqs3m1u2	cmljs6i9i0001if04ed1ndjvj	BORROWED	cmjv2i81c0000fwtxnvz3tjl1	APPROVED	BORROWED	Resource borrowing started	\N	2026-02-24 10:42:27.444
cmm1mzp3t0003l2042ejan6cx	cmm1mzo9e0001l204g34nbomg	CREATED	cmjd7zkxx0000i8txyfej9xrr	\N	PENDING	need resource for 20 days starting from 25/02/2026	\N	2026-02-25 06:11:44.729
cmm1n3wjz0003jv043y2g4108	cmm1n3vqr0001jv04t1wgwxi4	CREATED	cmjd7zkxx0000i8txyfej9xrr	\N	PENDING	need resource for 20 days from 25/02/2026	\N	2026-02-25 06:15:01.007
cmm1n9u220009jv04ca7eznik	cmm1n9t9f0007jv04tqx4t0d3	CREATED	cmjd7zkxx0000i8txyfej9xrr	\N	PENDING	type here.	\N	2026-02-25 06:19:37.706
\.


--
-- Data for Name: SoilWaterTestingProject; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."SoilWaterTestingProject" ("id", "name", "type", "imageUrl", "departmentId", "category", "bps", "quantityRequired", "budgetAllocationTotalMillion", "justificationOrYear", "createdAt", "updatedAt", "status") FROM stdin;
cmj65mn660000v8txdhibm1md	Total Employees Related Expenses	Budget	\N	soil-water	A01	\N	\N	30.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn660001v8txrratap0j	Total Operating Expenses	Budget	\N	soil-water	A03	\N	\N	30.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn660002v8txx6gmmsun	Commodity and Purchase	Budget	\N	soil-water	A093	\N	\N	50.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn660003v8txigh2keap	Civil Work	Budget	\N	soil-water	A12	\N	\N	30.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn660004v8txhxkisot6	Repair and Maintenance	Budget	\N	soil-water	A13	\N	\N	3.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn680005v8txbgp5du7h	Scientific Officer (Lab)	HR - Officers	\N	soil-water	\N	17	2	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn680006v8tx24a1ahg4	Law Officer	HR - Officers	\N	soil-water	\N	17	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn680007v8txgikcvggw	Quality & Technical Manager for ISO 17025	HR - Officers	\N	soil-water	\N	17	2	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn680008v8tx1a62lyhx	Instrument Technician	HR - Officers	\N	soil-water	\N	16	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn680009v8txgegkpw2j	Office Assistant	HR - Officials	\N	soil-water	\N	16	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn68000av8tx4m79ah2i	Instruments Engineer	HR - Officials	\N	soil-water	\N	16	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn68000bv8tx5u1yotfo	Computer Operator	HR - Officials	\N	soil-water	\N	15	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000cv8txn0lwkkzu	Senior Clerk	HR - Officials	\N	soil-water	\N	14	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000dv8txqm4bqqmg	Junior Clerk	HR - Officials	\N	soil-water	\N	11	2	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000ev8txldptrsfz	Accounts Clerk	HR - Officials	\N	soil-water	\N	11	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000fv8tx46fyy284	Lab Assistant	HR - Officials	\N	soil-water	\N	6	2	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000gv8txrm00lfwp	Lab Attendant	HR - Officials	\N	soil-water	\N	1	4	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000hv8txx08wde2x	Store Keeper	HR - Officials	\N	soil-water	\N	11	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000iv8txcstain75	Vehicle Driver	HR - Officials	\N	soil-water	\N	4	2	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000jv8txg1ec4knb	Naib Qasid	HR - Officials	\N	soil-water	\N	1	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000kv8txybweu5e9	Chowkidar	HR - Officials	\N	soil-water	\N	1	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000lv8txgi7zbmu3	Sweeper	HR - Officials	\N	soil-water	\N	1	1	\N	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000mv8txfuxxh2ct	Photo Copier	Machinery	\N	soil-water	\N	\N	1	\N	Seminars / workshops / meetings	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000nv8tx8pvgguw8	Air Conditioner 1.5 ton split	Machinery	\N	soil-water	\N	\N	4	\N	For office use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000ov8txcyruwngq	Drying Oven	Machinery	\N	soil-water	\N	\N	1	\N	For office use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000pv8txic4uzk4i	Digital Thermo-hygrometer	Machinery	\N	soil-water	\N	\N	4	\N	For office use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000qv8tx335dsdm5	Vehicle Hilux Double Cabin	Machinery	\N	soil-water	\N	\N	1	\N	For travelling	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000rv8txfqgvua8y	Multi Media	Machinery	\N	soil-water	\N	\N	1	\N	For seminars / trainings	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000sv8txbvohia10	Electronic Digital Balance (g) 4 decimal points	Machinery	\N	soil-water	\N	\N	4	\N	Office use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000tv8txhzjq7o2y	Block Digesters (20 Heads)	Machinery	\N	soil-water	\N	\N	2	\N	Lab use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000uv8tx5819l5cd	Centrifuge (4000 RPM)	Machinery	\N	soil-water	\N	\N	2	\N	Lab use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000vv8txp2hsftsy	Electric Distillaries	Machinery	\N	soil-water	\N	\N	3	\N	Lab use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000wv8txmx9tilsh	Reverse Osmosis Plant	Machinery	\N	soil-water	\N	\N	1	\N	Lab use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn69000xv8txzu1ohj75	Furnace (Up to 500°C)	Machinery	\N	soil-water	\N	\N	1	\N	Lab use	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a000yv8tx73267mkj	N Distillation Unit	Machinery	\N	soil-water	\N	\N	2	\N	N analysis	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a000zv8tx9pdyzg3u	Refrigerator	Machinery	\N	soil-water	\N	\N	2	\N	To maintain chemical reagents	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0010v8txbcxq5rtp	Steel Cupboards	Machinery	\N	soil-water	\N	\N	8	\N	Sample storage	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0011v8txddnzqxsh	Flame Photometer	Machinery	\N	soil-water	\N	\N	1	\N	K, Na & Ca analysis	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0012v8txqigf9hjk	Spectrophotometer	Machinery	\N	soil-water	\N	\N	1	\N	Boron and phosphorus analysis	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0013v8tx0wpxrusa	Scientific Officers	Budget Detail A011-1	\N	soil-water	\N	17	2	3.744	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0014v8tx344tavb4	Law Officer	Budget Detail A011-1	\N	soil-water	\N	17	1	1.869	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0015v8tx0fxhj7wv	QM & TM for ISO	Budget Detail A011-1	\N	soil-water	\N	17	2	3.744	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0016v8txkxmfq9xr	Instrument Technician	Budget Detail A011-1	\N	soil-water	\N	16	1	1.171	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0017v8txfdbc594r	Office Assistant	Budget Detail A012-2	\N	soil-water	\N	16	1	1.119	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0018v8tx0fie20yb	Computer Operator	Budget Detail A012-2	\N	soil-water	\N	15	1	1.014	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a0019v8tx4ulf8bxm	Senior Clerk	Budget Detail A012-2	\N	soil-water	\N	14	1	0.774	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001av8txur8x28ty	Junior Clerk	Budget Detail A012-2	\N	soil-water	\N	11	1	0.774	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001bv8txr176gte2	Accounts Clerk	Budget Detail A012-2	\N	soil-water	\N	11	1	0.681	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001cv8txe9e87f68	Lab Assistant	Budget Detail A012-2	\N	soil-water	\N	6	2	1.119	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001dv8txhj5mkg9m	Lab Attendant	Budget Detail A012-2	\N	soil-water	\N	1	4	1.057	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001ev8txay0e80db	Store Keeper	Budget Detail A012-2	\N	soil-water	\N	7	1	1.197	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001fv8tx42eq4o9p	Vehicle Driver	Budget Detail A012-2	\N	soil-water	\N	6	3	3.723	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001gv8tx35zspdz0	Naib Qasid	Budget Detail A012-2	\N	soil-water	\N	1	1	1.086	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001hv8txm5ijtqys	Chowkidar	Budget Detail A012-2	\N	soil-water	\N	1	1	1.086	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6a001iv8txruszs6kw	Sweeper	Budget Detail A012-2	\N	soil-water	\N	1	1	1.086	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001jv8tx3399miz2	House Rent Allowance	Allowance A012-1	\N	soil-water	A01202	\N	\N	3.489	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001kv8txu7td4dkh	Conveyance Allowance	Allowance A012-1	\N	soil-water	A01203	\N	\N	3.975	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001lv8txlm8qnazl	Washing Allowance	Allowance A012-1	\N	soil-water	A01207	\N	\N	0.012	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001mv8txlzu37z13	Integrated Allowance	Allowance A012-1	\N	soil-water	A0120D	\N	\N	0.228	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001nv8txamcmsp5b	Qualification Allowance	Allowance A012-1	\N	soil-water	A01216	\N	\N	0.228	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001ov8tx1037w913	Research Allowance	Allowance A012-1	\N	soil-water	—	\N	\N	4.761	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001pv8txi30394u7	Medical Allowance	Allowance A012-1	\N	soil-water	A01217	\N	\N	2.763	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001qv8txghqg0384	Adhoc Relief Allowance 15% (2022)	Allowance A012-1	\N	soil-water	—	\N	\N	3.549	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001rv8tx1nns3pen	Special Allowance 25% (2021)	Allowance A012-1	\N	soil-water	—	\N	\N	2.655	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001sv8txnksqvghr	SPE 15% (2022)	Allowance A012-1	\N	soil-water	—	\N	\N	1.626	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6b001tv8tx6fps9dfw	Others SSB 30%	Allowance A012-1	\N	soil-water	A01270	\N	\N	10.533	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001uv8txys0ws1vh	11.273	Allowance A012-1	\N	soil-water	Total A012-1	\N	\N	33.819	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001vv8txguzci4a7	Contingent Paid Staff	Contingent A01277	\N	soil-water	\N	\N	\N	0.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001wv8txhike78ss	Contingent Paid Staff	Contingent A01277	\N	soil-water	\N	\N	8	8.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001xv8tx3vig0y56	Postage & Telegraph	Communication A032	\N	soil-water	A03201	\N	\N	0.060	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001yv8txg79aefc2	Telephone & Trunk Calls	Communication A032	\N	soil-water	A03202	\N	\N	0.150	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c001zv8tx98hllm14	Courier Services	Communication A032	\N	soil-water	A03205	\N	\N	0.300	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c0020v8txaojv6mbq	0.17	Communication A032	\N	soil-water	Total A032	\N	\N	0.510	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c0021v8txm3jgeyq7	Electricity Charges	Utilities A033	\N	soil-water	A03303	\N	\N	10.650	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c0022v8tx08e2i547	Hot & Cold Weather Charges	Utilities A033	\N	soil-water	A03304	\N	\N	1.500	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6c0023v8tx63tpjm60	4.05	Utilities A033	\N	soil-water	Total A033	\N	\N	12.150	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0024v8txcbj4zxx3	Rates & Taxes	Occupancy A034	\N	soil-water	A03407	\N	\N	0.900	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0025v8tx5et8oyxp	T.A.	Travel A038	\N	soil-water	A03805	\N	\N	3.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0026v8tx4omq2xom	P.O.L.	Travel A038	\N	soil-water	A03807	\N	\N	7.500	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0027v8txjl1qu3ct	3.50	Travel A038	\N	soil-water	Total A038	\N	\N	10.500	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0028v8txd6oa2v97	Stationery	General A039	\N	soil-water	A03901	\N	\N	3.200	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d0029v8txrohssfe7	Printing & Publication	General A039	\N	soil-water	A03902	\N	\N	1.200	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002av8txgpcboluk	Newspapers & Books	General A039	\N	soil-water	A03905	\N	\N	2.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002bv8txxct0hdev	Publicity & Advertisement	General A039	\N	soil-water	A03907	\N	\N	0.800	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002cv8txm5krnfk8	Fair & Exhibition	General A039	\N	soil-water	A03918	\N	\N	1.200	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002dv8tx8yvrqq5z	Payment to other services	General A039	\N	soil-water	A03919	\N	\N	8.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002ev8txedibu52p	Cost of other stores	General A039	\N	soil-water	A03942	\N	\N	4.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002fv8txolq56ner	Others	General A039	\N	soil-water	A03970	\N	\N	6.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002gv8txpfehcgm5	6.6	General A039	\N	soil-water	Total A039	\N	\N	26.400	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002hv8txdxn6dhmy	2025-26	Physical Assets A09	\N	soil-water	\N	\N	\N	6.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002iv8txg9y01uh1	2026-27	Physical Assets A09	\N	soil-water	\N	\N	\N	16.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002jv8txvv8kz2wu	2027-28	Physical Assets A09	\N	soil-water	\N	\N	\N	6.500	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002kv8txlftajju2	2028-29	Physical Assets A09	\N	soil-water	\N	\N	\N	7.500	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002lv8tx2o9cl030	Total	Physical Assets A09	\N	soil-water	\N	\N	\N	36.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6d002mv8tx16vn4one	Office Building & Residences	Civil Work A12	\N	soil-water	\N	\N	\N	30.000	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002nv8txoctmnbqv	Transport	Repair & Maintenance A13	\N	soil-water	A13001	\N	\N	1.700	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002ov8txvgn413lh	Machinery & Equipment	Repair & Maintenance A13	\N	soil-water	A13101	\N	\N	1.600	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002pv8txmz76l92v	Furniture	Repair & Maintenance A13	\N	soil-water	A13701	\N	\N	1.106	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002qv8txgdzg0bju	2.3	Repair & Maintenance A13	\N	soil-water	Total A13	\N	\N	4.406	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002rv8txcprggyqh	2025-26	Grand Total	\N	soil-water	\N	\N	\N	8.300	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002sv8txfzw510da	2026-27	Grand Total	\N	soil-water	\N	\N	\N	33.773	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002tv8tx80n6jat9	2027-28	Grand Total	\N	soil-water	\N	\N	\N	50.649	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002uv8txy5t1eu3k	2028-29	Grand Total	\N	soil-water	\N	\N	\N	41.526	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
cmj65mn6e002vv8txl3p261gl	Overall Total	Grand Total	\N	soil-water	\N	\N	\N	132.548	\N	2025-12-14 20:05:25.906	2025-12-14 20:05:25.906	AVAILABLE
\.


--
-- Data for Name: ValueAdditionLabEquipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ValueAdditionLabEquipment" ("id", "name", "type", "imageUrl", "departmentId", "labName", "roomNumber", "blockName", "quantity", "focalPerson", "displayOrder", "createdAt", "updatedAt", "status") FROM stdin;
cmj65ozx3000y8otxpehvlrgt	Kjeldahl Apparatus (Digestion & Distillation Unit)	Analytical Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	1	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3000z8otx0rtu7ex0	Water Activity Meter	Analytical Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	2	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300108otxwx447k5b	Soxhlet Apparatus	Analytical Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	3	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300118otxtnwxjicz	Analytical Weighing Balance	Balances & Scales	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	4	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300128otxkwydrz9z	Autoclave	Sterilization	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	5	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300138otx6e49itdu	Texture Analyzer	Analytical Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	6	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300148otxa0ag13uu	Freeze Dryer	Processing Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	7	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300158otxseafjmt0	Pulse Electric Field	Processing Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	8	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300168otxfz13sl96	Ozonation Chamber	Processing Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	9	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300178otxsf7zy8vz	Pasteurizer	Processing Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	10	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300188otxjtdber7t	Fermenter	Processing Equipment	\N	mnsuam	Value Addition and Food Analysis Lab	127	Academic Block	1	Dr. Shabbir Ahmad	11	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx300198otxfroapmmd	Kjeldahl Apparatus	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	12	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3001a8otx9brgnbpp	Digestion Unit and Distillation Unit	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	13	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3001b8otx3b30k2ku	Moisture Analyzer	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	14	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3001c8otx41wcrvsl	Soxhlet Apparatus	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	15	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3001d8otxl3dbreae	Analytical Weighing Balance	Balances & Scales	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	16	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx3001e8otxctps5mt4	Muffle Furnace	Heating Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	17	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001f8otxwta4cjp7	Viscometer	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	18	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001g8otxqichmuu1	Farinograph	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	19	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001h8otxrz80bkw9	Fume Hood	Safety Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	20	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001i8otx8pr3ymjl	Desiccator	Storage Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	21	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001j8otx4wx8tldg	Gerber Machine	Analytical Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	22	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001k8otxtylzcpe4	Rose Head Machine	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	23	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001l8otx6w6cl0yg	Abrasive Peeler	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	24	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001m8otxgmt5ncq6	Refrigerator	Storage Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	25	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001n8otxvahvi1ov	China Chakki	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	26	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001o8otxd69tkopu	Grinder	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	27	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001p8otxdecybv6u	Cheese Press	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	28	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001q8otxw46jzc6n	Cheese Vat	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	29	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
cmj65ozx4001r8otxh9otn0gi	Cream Separator	Processing Equipment	\N	mnsuam	Nutrient Analytical & Food Processing Lab	114-115	Postgraduate Block	1	Dr. Shabbir Ahmad	30	2025-12-14 20:07:15.755	2025-12-14 20:07:15.755	AVAILABLE
\.


--
-- Data for Name: VisitorCounter; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."VisitorCounter" ("id", "count", "createdAt", "updatedAt") FROM stdin;
277e30ef-68d4-4594-b371-9d51f0bf49fd	552	2026-01-18 09:29:25.608818+00	2026-03-24 13:03:45.986+00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "logs", "rolled_back_at", "started_at", "applied_steps_count") FROM stdin;
14cb4a60-261a-487b-9a8e-bc30df239946	f93518ade17c8ff0cc6208b75d34c7d9a2a8800b6fde29eb2013e9e2544a2955	2025-12-14 20:00:09.004146+00	20251214183353_init_schema	\N	\N	2025-12-14 20:00:07.810711+00	1
ce61e829-f977-4f4f-8424-ec4f1b4f0c85	962ce3303359f1785ecb07d81635f06bb3273db977087c99f577c079a293102e	2025-12-14 20:00:10.312034+00	20251214192841_add_agricultural_extension_wing	\N	\N	2025-12-14 20:00:09.371344+00	1
c72ce1dc-1941-424e-9416-25a656a8a61f	4a6862a0d2477d863d47a4dc7222e622418302ad0990bcb8e2556a8466368e7e	2025-12-26 13:25:13.636+00	20251221173000_add_adaptive_research_positions	\N	\N	2025-12-26 13:25:13.636+00	1
\.


--
-- Data for Name: ento_inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ento_inventory_items" ("id", "item_no", "name", "quantity_label", "date_received", "last_verified", "last_verification_label", "register_label", "source_line", "created_at", "updated_at") FROM stdin;
1	1	Varnish	4 kg	1997-05-26	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 1  | Varnish                                     | 4 kg                 | 26.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
2	3	Chak matte special	06 Kg	1997-06-02	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 3  | Chak matte special                          | 06 Kg                | 02.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
3	4	Zinc	3 Kg	1997-06-02	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 4  | Zinc                                        | 3 Kg                 | 02.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
4	5	Plaster of paris	5 Kg	1997-06-02	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 5  | Plaster of paris                            | 5 Kg                 | 02.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
5	6	Distember	4	1997-06-02	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 6  | Distember                                   | 4                    | 02.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
6	7	Sheet BKA light	7	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 7  | Sheet BKA light                             | 7                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
7	8	Wooden board 6 × 6 inches	7	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 8  | Wooden board 6 × 6 inches                   | 7                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
8	9	Sheet BKA light	1	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 9  | Sheet BKA light                             | 1                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
9	10	Pipe plastic ¾ inch	12	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 10 | Pipe plastic ¾ inch                         | 12                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
10	11	Plastic elbow ¾ inch	2 dozen	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 11 | Plastic elbow ¾ inch                        | 2 dozen              | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
11	12	Plastic clip ¾ inch	7 dozen	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 12 | Plastic clip ¾ inch                         | 7 dozen              | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
12	13	Solution tape	03	1997-05-29	1999-03-18	18.03.1999	Stock Register (2) - CLCV Project	| 13 | Solution tape                               | 03                   | 29.05.1997    | 18.03.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
13	14	Screw	Two dozen	1997-05-29	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 14 | Screw                                       | Two dozen            | 29.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
14	15	Bell switch	1	1997-05-29	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 15 | Bell switch                                 | 1                    | 29.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
15	16	Screw Patch	1	1997-05-29	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 16 | Screw Patch                                 | 1                    | 29.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
16	17	Rawal Plug	1	1997-05-29	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 17 | Rawal Plug                                  | 1                    | 29.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
17	18	Nut and screw ½ inch	03 dozen	1997-05-29	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 18 | Nut and screw ½ inch                        | 03 dozen             | 29.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
18	19	Electric wire	20 meter	1997-05-19	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 19 | Electric wire                               | 20 meter             | 19.05.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
19	20	Electric wire	100 yards / 70 yards	1997-06-05	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 20 | Electric wire                               | 100 yards / 70 yards | 05.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
20	21	Main switch 30 A	02	1997-06-05	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 21 | Main switch 30 A                            | 02                   | 05.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
21	22	Power plug	07	1997-06-05	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 22 | Power plug                                  | 07                   | 05.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
22	23	Clump	06	1997-06-05	1999-08-26	26.08.1999	Stock Register (2) - CLCV Project	| 23 | Clump                                       | 06                   | 05.06.1997    | 26.08.1999        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
23	24	Bell Push button	1	1997-06-05	\N	–	Stock Register (2) - CLCV Project	| 24 | Bell Push button                            | 1                    | 05.06.1997    | –                 |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
24	25	Tube light complete	06	1997-05-28	2013-09-20	20.09.2013	Stock Register (2) - CLCV Project	| 25 | Tube light complete                         | 06                   | 28.05.1997    | 20.09.2013        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
25	26	Circuit breaker	1	1997-05-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 26 | Circuit breaker                             | 1                    | 28.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
26	27	Petri-Dishes 40 ml	200	1997-09-05	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 27 | Petri-Dishes 40 ml                          | 200                  | 05.09.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
27	28	Petri-Dishes for whitefly	250	1997-11-10	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 28 | Petri-Dishes for whitefly                   | 250                  | 10.11.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
28	29	Insect collection vials	200	1997-11-10	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 29 | Insect collection vials                     | 200                  | 10.11.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
29	30	Micro guage 32 ml plastic	200	1997-11-15	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 30 | Micro guage 32 ml plastic                   | 200                  | 15.11.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
30	31	Micro guage 40 ml plastic for whitefly	200	1997-12-16	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 31 | Micro guage 40 ml plastic for whitefly      | 200                  | 16.12.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
31	32	Light microscope	One	1998-03-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 32 | Light microscope                            | One                  | 29.03.1998    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
32	33	Test tubes with cover	25	1988-03-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 33 | Test tubes with cover                       | 25                   | 29.03.1988    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
33	34	Beyn vials 25 ml size	25	1988-03-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 34 | Beyn vials 25 ml size                       | 25                   | 29.03.1988    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
34	35	Generator	1	1998-02-25	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 35 | Generator                                   | 1                    | 25.02.1998    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
35	36	Calculator CT 500	1	1998-01-01	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 36 | Calculator CT 500                           | 1                    | 01.01.1998    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
36	37	Horizontal venation blinds	2	1997-11-18	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 37 | Horizontal venation blinds                  | 2                    | 18.11.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
37	38	Curtains	4	1997-09-17	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 38 | Curtains                                    | 4                    | 17.09.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
38	39	Elbow ½ × ¾ inches	2	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 39 | Elbow ½ × ¾ inches                          | 2                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
39	40	Iron pipe one inch diameter	1	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 40 | Iron pipe one inch diameter                 | 1                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
40	41	Sink Bracket (fitted with sink)	1	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 41 | Sink Bracket (fitted with sink)             | 1                    | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
41	42	Rubber (fitted with sink)	01	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 42 | Rubber (fitted with sink)                   | 01                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
42	43	Barrel Nipple ¾ inch fitted with iron pipe	01	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 43 | Barrel Nipple ¾ inch fitted with iron pipe  | 01                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
43	44	Union ½ inch	02	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 44 | Union ½ inch                                | 02                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
44	45	Handle valve	01	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 45 | Handle valve                                | 01                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
45	46	Iron hook connected with water pipe	06	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 46 | Iron hook connected with water pipe         | 06                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
46	47	T-½ inch iron pipe	02	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 47 | T-½ inch iron pipe                          | 02                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
47	48	Barrel nipple ½ inch fitted with sink	06	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 48 | Barrel nipple ½ inch fitted with sink       | 06                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
48	49	T-½ × ¾ inches connected with sink	01	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 49 | T-½ × ¾ inches connected with sink          | 01                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
49	50	Socket	06	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 50 | Socket                                      | 06                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
50	51	Elbow ½ inch	06	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 51 | Elbow ½ inch                                | 06                   | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
51	52	Iron pipe ¾ inches	100 inch length	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 52 | Iron pipe ¾ inches                          | 100 inch length      | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
52	53	Waste pipe	One	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 53 | Waste pipe                                  | One                  | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
53	54	Waste sink	One	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 54 | Waste sink                                  | One                  | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
54	55	Sink lock	One	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 55 | Sink lock                                   | One                  | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
55	56	Sink	One	1997-05-29	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 56 | Sink                                        | One                  | 29.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
56	57	Dimmer	One	1997-03-07	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 57 | Dimmer                                      | One                  | 07.03.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
57	58	Exhaust fan	One	1997-03-07	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 58 | Exhaust fan                                 | One                  | 07.03.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
58	59	Wire guage grill	Two	1997-06-05	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 59 | Wire guage grill                            | Two                  | 05.06.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
59	60	Iron safety cover for AC	One	1997-05-14	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 60 | Iron safety cover for AC                    | One                  | 14.05.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
60	61	Thermo control packing hot & cool chamber	One	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 61 | Thermo control packing hot & cool chamber   | One                  | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
61	62	Magnetic stirrer	One	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 62 | Magnetic stirrer                            | One                  | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
62	63	Micro pipette	Three	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 63 | Micro pipette                               | Three                | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
63	64	Micro liter syringe Hamilton	Three	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 64 | Micro liter syringe Hamilton                | Three                | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
64	65	Automatic time switch	01	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 65 | Automatic time switch                       | 01                   | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
65	66	Humidifier Jet cool Super Asia	01	1997-02-28	2016-09-01	01.09.2016	Stock Register (2) - CLCV Project	| 66 | Humidifier Jet cool Super Asia              | 01                   | 28.02.1997    | 01.09.2016        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
66	67	Incubator TV-100	01	1997-02-28	2018-04-11	11.04.2018	Stock Register (2) - CLCV Project	| 67 | Incubator TV-100                            | 01                   | 28.02.1997    | 11.04.2018        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
67	68	Swift Stereo SM-80	01	1997-02-28	2018-04-11	11.04.2018	Stock Register (2) - CLCV Project	| 68 | Swift Stereo SM-80                          | 01                   | 28.02.1997    | 11.04.2018        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
68	69	Anesthesia chamber	01	1997-02-28	2018-04-11	11.04.2018	Stock Register (2) - CLCV Project	| 69 | Anesthesia chamber                          | 01                   | 28.02.1997    | 11.04.2018        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
69	70	Low temperature incubator	01	1997-02-28	2020-10-13	13.10.2020	Stock Register (2) - CLCV Project	| 70 | Low temperature incubator                   | 01                   | 28.02.1997    | 13.10.2020        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
70	71	Air conditioner cooling Deluxe	01	1997-02-28	2020-10-13	13.10.2020	Stock Register (2) - CLCV Project	| 71 | Air conditioner cooling Deluxe              | 01                   | 28.02.1997    | 13.10.2020        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
71	72	Refrigerator 2 in one temperature incubator	01	2014-04-22	2020-10-13	13.10.2020	Stock Register (2) - CLCV Project	| 72 | Refrigerator 2 in one temperature incubator | 01                   | 22.04.2014    | 13.10.2020        |	2025-12-14 20:07:51.082341+00	2025-12-14 20:07:51.082341+00
\.


--
-- Data for Name: ento_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ento_profile" ("id", "department_id", "department_name", "location", "focal_person", "designation", "email", "officers", "officials", "land_acres", "rooms", "register_title", "register_note", "compiled_on", "created_at", "updated_at") FROM stdin;
1	ento	Entomological Research Sub Station Multan	Multan, Punjab	Dr. Asifa Hameed	Principal Scientist	asifa_hameed_sheikh@yahoo.com	3	2	3.50	5	List of Non-Consumable Items - Stock Register (2) - CLCV Project	Exact entries from ERSS Multan stock register including continuation notes for Register (3), DSR/auction remarks, and verification history.	2025-08-25	2025-12-14 20:07:50.812334+00	2025-12-14 20:07:50.812334+00
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
equipment-images	equipment-images	\N	2025-11-27 10:59:04.833593+00	2025-11-27 10:59:04.833593+00	t	f	\N	\N	\N	STANDARD
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
44b03805-fef3-4ccb-a487-6a8372024bfb	equipment-images	equipment/1764241374574-wb44gos1lpl.jpg	\N	2025-11-27 11:02:57.203602+00	2025-11-27 11:02:57.203602+00	2025-11-27 11:02:57.203602+00	{"eTag": "\\"a523db939533b84b133acec031b21ec3\\"", "size": 223855, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:02:58.000Z", "contentLength": 223855, "httpStatusCode": 200}	6c7c4594-fb82-4c01-abef-ee1afe039744	\N	{}
8e96b26b-d82c-4669-a3ba-d901f893b040	equipment-images	equipment/1764241543113-2x1mmlmrqsi.webp	\N	2025-11-27 11:05:44.965696+00	2025-11-27 11:05:44.965696+00	2025-11-27 11:05:44.965696+00	{"eTag": "\\"11852271acfeb8a2f1716a44fbf175d5\\"", "size": 15544, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:05:45.000Z", "contentLength": 15544, "httpStatusCode": 200}	860b4ac4-4506-4efe-b7ff-58f347e8ce1b	\N	{}
86ace627-4210-41cc-bf09-81d4c985e0b4	equipment-images	equipment/1764241631620-y7kn90lbrph.webp	\N	2025-11-27 11:07:12.854269+00	2025-11-27 11:07:12.854269+00	2025-11-27 11:07:12.854269+00	{"eTag": "\\"f171f88fb4ed82ac7d4647b60c83255b\\"", "size": 6922, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:07:13.000Z", "contentLength": 6922, "httpStatusCode": 200}	cb9ebaf4-c680-4fb4-a02a-2c2a34c1845e	\N	{}
626ab1ae-f136-40f0-b9d2-eb246f1bc57d	equipment-images	equipment/1764241739606-gfhrevqb07c.jpg	\N	2025-11-27 11:09:01.209503+00	2025-11-27 11:09:01.209503+00	2025-11-27 11:09:01.209503+00	{"eTag": "\\"dcc47df114badcad0627205816adc4e8\\"", "size": 26783, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:09:02.000Z", "contentLength": 26783, "httpStatusCode": 200}	26f4dbab-c2f0-4dfc-acfc-9a01f4d2e1d7	\N	{}
25b33d0e-15a8-4a85-aa07-e2cdc1ac0b65	equipment-images	equipment/1764241939901-8yxeaa5wsbq.jpeg	\N	2025-11-27 11:12:22.256584+00	2025-11-27 11:12:22.256584+00	2025-11-27 11:12:22.256584+00	{"eTag": "\\"7fe84d5d0ca09afdc96156da023ca631\\"", "size": 169212, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:12:23.000Z", "contentLength": 169212, "httpStatusCode": 200}	89ef4b34-0e8d-4147-8bd1-f618f416a444	\N	{}
6db5a656-78b2-4b99-9247-30ca8a32cc7c	equipment-images	equipment/1764244677404-8nn16cssh4u.jpg	\N	2025-11-27 11:57:59.771805+00	2025-11-27 11:57:59.771805+00	2025-11-27 11:57:59.771805+00	{"eTag": "\\"8a1b05e1ff35e773c2fa9dfbabf65f6a\\"", "size": 136542, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2025-11-27T11:58:00.000Z", "contentLength": 136542, "httpStatusCode": 200}	ad2e72aa-a37b-4d6d-b391-d24b7c6cb1ed	\N	{}
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: ento_inventory_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ento_inventory_items_id_seq"', 71, true);


--
-- Name: ento_profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."ento_profile_id_seq"', 1, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict FCFvLg8nUDQXUdwCMEmD0q4lrTd58tXJOGdjsh7wRIcEDNz1MPjT4ZlJhz1IRT4

RESET ALL;
