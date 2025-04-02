import dedent from "dedent";

export function getFreshnessPrompt({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): string {
  return dedent`
    You are an evaluator that analyzes if answer content is likely outdated based on mentioned dates (or implied datetime) and current system time: ${new Date().toISOString()}.

    <rules>
    Question-Answer Freshness Checker Guidelines

    # Revised QA Type Maximum Age Table

    | QA Type                  | Max Age (Days) | Notes                                                                 |
    |--------------------------|--------------|-----------------------------------------------------------------------|
    | Financial Data (Real-time)| 0.1        | Stock prices, exchange rates, crypto (real-time preferred)             |
    | Breaking News            | 1           | Immediate coverage of major events                                     |
    | News/Current Events      | 1           | Time-sensitive news, politics, or global events                        |
    | Weather Forecasts        | 1           | Accuracy drops significantly after 24 hours                            |
    | Sports Scores/Events     | 1           | Live updates required for ongoing matches                              |
    | Security Advisories      | 1           | Critical security updates and patches                                  |
    | Social Media Trends      | 1           | Viral content, hashtags, memes                                         |
    | Cybersecurity Threats    | 7           | Rapidly evolving vulnerabilities/patches                               |
    | Tech News                | 7           | Technology industry updates and announcements                          |
    | Political Developments   | 7           | Legislative changes, political statements                              |
    | Political Elections      | 7           | Poll results, candidate updates                                        |
    | Sales/Promotions         | 7           | Limited-time offers and marketing campaigns                            |
    | Travel Restrictions      | 7           | Visa rules, pandemic-related policies                                  |
    | Entertainment News       | 14          | Celebrity updates, industry announcements                              |
    | Product Launches         | 14          | New product announcements and releases                                 |
    | Market Analysis          | 14          | Market trends and competitive landscape                                |
    | Competitive Intelligence | 21          | Analysis of competitor activities and market position                  |
    | Product Recalls          | 30          | Safety alerts or recalls from manufacturers                            |
    | Industry Reports         | 30          | Sector-specific analysis and forecasting                               |
    | Software Version Info    | 30          | Updates, patches, and compatibility information                        |
    | Legal/Regulatory Updates | 30          | Laws, compliance rules (jurisdiction-dependent)                        |
    | Economic Forecasts       | 30          | Macroeconomic predictions and analysis                                 |
    | Consumer Trends          | 45          | Shifting consumer preferences and behaviors                            |
    | Scientific Discoveries   | 60          | New research findings and breakthroughs (includes all scientific research) |
    | Healthcare Guidelines    | 60          | Medical recommendations and best practices (includes medical guidelines)|
    | Environmental Reports    | 60          | Climate and environmental status updates                               |
    | Best Practices           | 90          | Industry standards and recommended procedures                          |
    | API Documentation        | 90          | Technical specifications and implementation guides                     |
    | Tutorial Content         | 180         | How-to guides and instructional materials (includes educational content)|
    | Tech Product Info        | 180         | Product specs, release dates, or pricing                               |
    | Statistical Data         | 180         | Demographic and statistical information                                |
    | Reference Material       | 180         | General reference information and resources                            |
    | Historical Content       | 365         | Events and information from the past year                              |
    | Cultural Trends          | 730         | Shifts in language, fashion, or social norms                           |
    | Entertainment Releases   | 730         | Movie/TV show schedules, media catalogs                                |
    | Factual Knowledge        | ∞           | Static facts (e.g., historical events, geography, physical constants)   |

    ### Implementation Notes:
    1. **Contextual Adjustment**: Freshness requirements may change during crises or rapid developments in specific domains.
    2. **Tiered Approach**: Consider implementing urgency levels (critical, important, standard) alongside age thresholds.
    3. **User Preferences**: Allow customization of thresholds for specific query types or user needs.
    4. **Source Reliability**: Pair freshness metrics with source credibility scores for better quality assessment.
    5. **Domain Specificity**: Some specialized fields (medical research during pandemics, financial data during market volatility) may require dynamically adjusted thresholds.
    6. **Geographic Relevance**: Regional considerations may alter freshness requirements for local regulations or events.
    </rules>

    Now evaluate this pair:
    Question: ${question}
    Answer: ${answer}
`;
}

export function getDefinitivePrompt({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): string {
  return dedent`
    You are an evaluator of answer definitiveness. Analyze if the given answer provides a definitive response or not.

    <rules>
    First, if the answer is not a direct response to the question, it must return false. 
    Definitiveness is the king! The following types of responses are NOT definitive and must return false:
      1. Expressions of uncertainty: "I don't know", "not sure", "might be", "probably"
      2. Lack of information statements: "doesn't exist", "lack of information", "could not find"
      3. Inability statements: "I cannot provide", "I am unable to", "we cannot"
      4. Negative statements that redirect: "However, you can...", "Instead, try..."
      5. Non-answers that suggest alternatives
    </rules>

    <examples>
    Question: "What are the system requirements for running Python 3.9?"
    Answer: "I'm not entirely sure, but I think you need a computer with some RAM."
    Evaluation: {
      "think": "The answer contains uncertainty markers like 'not entirely sure' and 'I think', making it non-definitive."
      "pass": false,
    }

    Question: "What are the system requirements for running Python 3.9?"
    Answer: "Python 3.9 requires Windows 7 or later, macOS 10.11 or later, or Linux."
    Evaluation: {
      "think": "The answer makes clear, definitive statements without uncertainty markers or ambiguity."
      "pass": true,
    }

    Question: "Who will be the president of the United States in 2032?"
    Answer: "I cannot predict the future, it depends on the election results."
    Evaluation: {
      "think": "The answer contains a statement of inability to predict the future, making it non-definitive."
      "pass": false,
    }

    Question: "Who is the sales director at Company X?"
    Answer: "I cannot provide the name of the sales director, but you can contact their sales team at sales@companyx.com"
    Evaluation: {
      "think": "The answer starts with 'I cannot provide' and redirects to an alternative contact method instead of answering the original question."
      "pass": false,
    }

    Question: "what is the twitter account of jina ai's founder?"
    Answer: "The provided text does not contain the Twitter account of Jina AI's founder."
    Evaluation: {
      "think": "The answer indicates a lack of information rather than providing a definitive response."
      "pass": false,
    }

    Question: "量子コンピュータの計算能力を具体的に測定する方法は何ですか？"
    Answer: "量子コンピュータの計算能力は量子ビット（キュービット）の数、ゲート忠実度、コヒーレンス時間で測定されます。"
    Evaluation: {
      "think": "The answer provides specific, definitive metrics for measuring quantum computing power without uncertainty markers or qualifications."
      "pass": true,
    }

    Question: "如何证明哥德巴赫猜想是正确的？"
    Answer: "目前尚无完整证明，但2013年张益唐证明了存在无穷多对相差不超过7000万的素数，后来这个界被缩小到246。"
    Evaluation: {
      "think": "The answer begins by stating no complete proof exists, which is a non-definitive response, and then shifts to discussing a related but different theorem about bounded gaps between primes."
      "pass": false,
    }

    Question: "Wie kann man mathematisch beweisen, dass P ≠ NP ist?"
    Answer: "Ein Beweis für P ≠ NP erfordert, dass man zeigt, dass mindestens ein NP-vollständiges Problem nicht in polynomieller Zeit lösbar ist. Dies könnte durch Diagonalisierung, Schaltkreiskomplexität oder relativierende Barrieren erreicht werden."
    Evaluation: {
      "think": "The answer provides concrete mathematical approaches to proving P ≠ NP without uncertainty markers, presenting definitive methods that could be used."
      "pass": true,
    }
    </examples>

    Now evaluate this pair:
    Question: ${question}
    Answer: ${answer}
  `;
}

export function getPluralityPrompt({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): string {
  return dedent`
    You are an evaluator that analyzes if answers provide the appropriate number of items requested in the question.

    <rules>
    Question Type Reference Table

    | Question Type | Expected Items | Evaluation Rules |
    |---------------|----------------|------------------|
    | Explicit Count | Exact match to number specified | Provide exactly the requested number of distinct, non-redundant items relevant to the query. |
    | Numeric Range | Any number within specified range | Ensure count falls within given range with distinct, non-redundant items. For "at least N" queries, meet minimum threshold. |
    | Implied Multiple | ≥ 2 | Provide multiple items (typically 2-4 unless context suggests more) with balanced detail and importance. |
    | "Few" | 2-4 | Offer 2-4 substantive items prioritizing quality over quantity. |
    | "Several" | 3-7 | Include 3-7 items with comprehensive yet focused coverage, each with brief explanation. |
    | "Many" | 7+ | Present 7+ items demonstrating breadth, with concise descriptions per item. |
    | "Most important" | Top 3-5 by relevance | Prioritize by importance, explain ranking criteria, and order items by significance. |
    | "Top N" | Exactly N, ranked | Provide exactly N items ordered by importance/relevance with clear ranking criteria. |
    | "Pros and Cons" | ≥ 2 of each category | Present balanced perspectives with at least 2 items per category addressing different aspects. |
    | "Compare X and Y" | ≥ 3 comparison points | Address at least 3 distinct comparison dimensions with balanced treatment covering major differences/similarities. |
    | "Steps" or "Process" | All essential steps | Include all critical steps in logical order without missing dependencies. |
    | "Examples" | ≥ 3 unless specified | Provide at least 3 diverse, representative, concrete examples unless count specified. |
    | "Comprehensive" | 10+ | Deliver extensive coverage (10+ items) across major categories/subcategories demonstrating domain expertise. |
    | "Brief" or "Quick" | 1-3 | Present concise content (1-3 items) focusing on most important elements described efficiently. |
    | "Complete" | All relevant items | Provide exhaustive coverage within reasonable scope without major omissions, using categorization if needed. |
    | "Thorough" | 7-10 | Offer detailed coverage addressing main topics and subtopics with both breadth and depth. |
    | "Overview" | 3-5 | Cover main concepts/aspects with balanced coverage focused on fundamental understanding. |
    | "Summary" | 3-5 key points | Distill essential information capturing main takeaways concisely yet comprehensively. |
    | "Main" or "Key" | 3-7 | Focus on most significant elements fundamental to understanding, covering distinct aspects. |
    | "Essential" | 3-7 | Include only critical, necessary items without peripheral or optional elements. |
    | "Basic" | 2-5 | Present foundational concepts accessible to beginners focusing on core principles. |
    | "Detailed" | 5-10 with elaboration | Provide in-depth coverage with explanations beyond listing, including specific information and nuance. |
    | "Common" | 4-8 most frequent | Focus on typical or prevalent items, ordered by frequency when possible, that are widely recognized. |
    | "Primary" | 2-5 most important | Focus on dominant factors with explanation of their primacy and outsized impact. |
    | "Secondary" | 3-7 supporting items | Present important but not critical items that complement primary factors and provide additional context. |
    | Unspecified Analysis | 3-5 key points | Default to 3-5 main points covering primary aspects with balanced breadth and depth. |
    </rules>

    Now evaluate this pair:
    Question: ${question}
    Answer: ${answer}
  `;
}

export function getCompletenessPrompt({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): string {
  return dedent`
    You are an evaluator that determines if an answer addresses all explicitly mentioned aspects of a multi-aspect question.

    <rules>
    For questions with **explicitly** multiple aspects:

    1. Explicit Aspect Identification:
      - Only identify aspects that are explicitly mentioned in the question
      - Look for specific topics, dimensions, or categories mentioned by name
      - Aspects may be separated by commas, "and", "or", bullets, or mentioned in phrases like "such as X, Y, and Z"
      - DO NOT include implicit aspects that might be relevant but aren't specifically mentioned

    2. Coverage Assessment:
      - Each explicitly mentioned aspect should be addressed in the answer
      - Recognize that answers may use different terminology, synonyms, or paraphrases for the same aspects
      - Look for conceptual coverage rather than exact wording matches
      - Calculate a coverage score (aspects addressed / aspects explicitly mentioned)

    3. Pass/Fail Determination:
      - Pass: Addresses all explicitly mentioned aspects, even if using different terminology or written in different language styles
      - Fail: Misses one or more explicitly mentioned aspects
    </rules>

    <examples>
    Question: "How does climate change impact agricultural practices, water resources, and biodiversity in Mediterranean regions?"
    Answer: "Climate change affects Mediterranean agriculture through rising temperatures and changing rainfall patterns. Farmers now implement drip irrigation to conserve water and shift planting schedules. Freshwater availability has decreased dramatically, with groundwater depletion and seasonal streams drying up earlier each year."
    Aspects_Expected: "agricultural practices, water resources, biodiversity"
    Aspects_Provided: "farming adaptations, irrigation methods, precipitation changes, freshwater availability, groundwater depletion"
    Think: "The question explicitly mentions three aspects: agricultural practices, water resources, and biodiversity. The answer addresses agricultural practices (discussing farming adaptations, irrigation methods, planting schedules) and water resources (covering freshwater availability, groundwater depletion, seasonal streams). However, it completely omits any discussion of biodiversity effects, which was explicitly requested in the question."
    Pass: false

    Question: "What are the key considerations when designing a microservice architecture, including scalability, fault tolerance, and data consistency patterns?"
    Answer: "When engineering distributed systems, horizontal expansion capacity is crucial - teams should implement load distribution and auto-scaling for peak demand periods. System resilience is achieved through failure detection mechanisms, redundancy implementations, and isolation boundaries to prevent cascading outages. For maintaining data integrity across services, developers can implement orchestrated transaction sequences, append-only event logs, and separate command/query responsibility models."
    Aspects_Expected: "scalability, fault tolerance, data consistency patterns"
    Aspects_Provided: "horizontal expansion capacity, load distribution, auto-scaling, system resilience, failure detection, redundancy, isolation boundaries, data integrity, orchestrated transaction sequences, append-only event logs, command/query responsibility models"
    Think: "The question explicitly mentions three aspects of microservice architecture: scalability, fault tolerance, and data consistency patterns. Although using different terminology, the answer addresses all three: scalability (through 'horizontal expansion capacity', 'load distribution', and 'auto-scaling'), fault tolerance (via 'system resilience', 'failure detection', 'redundancy', and 'isolation boundaries'), and data consistency patterns (discussing 'data integrity', 'orchestrated transaction sequences', 'append-only event logs', and 'command/query responsibility models'). All explicitly mentioned aspects are covered despite the terminology differences."
    Pass: true

    Question: "Compare iOS and Android in terms of user interface, app ecosystem, and security."
    Answer: "Apple's mobile platform presents users with a curated visual experience emphasizing minimalist design and consistency, while Google's offering focuses on flexibility and customization options. The App Store's review process creates a walled garden with higher quality control but fewer options, whereas Play Store offers greater developer freedom and variety. Apple employs strict sandboxing techniques and maintains tight hardware-software integration."
    Aspects_Expected: "user interface, app ecosystem, security"
    Aspects_Provided: "visual experience, minimalist design, flexibility, customization, App Store review process, walled garden, quality control, Play Store, developer freedom, sandboxing, hardware-software integration"
    Think: "The question explicitly asks for a comparison of iOS and Android across three specific aspects: user interface, app ecosystem, and security. The answer addresses user interface (discussing 'visual experience', 'minimalist design', 'flexibility', and 'customization') and app ecosystem (mentioning 'App Store review process', 'walled garden', 'quality control', 'Play Store', and 'developer freedom'). For security, it mentions 'sandboxing' and 'hardware-software integration', which are security features of iOS, but doesn't provide a comparative analysis of Android's security approach. Since security is only partially addressed for one platform, the comparison of this aspect is incomplete."
    Pass: false

    Question: "Explain how social media affects teenagers' mental health, academic performance, and social relationships."
    Answer: "Platforms like Instagram and TikTok have been linked to psychological distress among adolescents, with documented increases in comparative thinking patterns and anxiety about social exclusion. Scholastic achievement often suffers as screen time increases, with homework completion rates declining and attention spans fragmenting during study sessions. Peer connections show a complex duality - digital platforms facilitate constant contact with friend networks while sometimes diminishing in-person social skill development and enabling new forms of peer harassment."
    Aspects_Expected: "mental health, academic performance, social relationships"
    Aspects_Provided: "psychological distress, comparative thinking, anxiety about social exclusion, scholastic achievement, screen time, homework completion, attention spans, peer connections, constant contact with friend networks, in-person social skill development, peer harassment"
    Think: "The question explicitly asks about three aspects of social media's effects on teenagers: mental health, academic performance, and social relationships. The answer addresses all three using different terminology: mental health (discussing 'psychological distress', 'comparative thinking', 'anxiety about social exclusion'), academic performance (mentioning 'scholastic achievement', 'screen time', 'homework completion', 'attention spans'), and social relationships (covering 'peer connections', 'constant contact with friend networks', 'in-person social skill development', and 'peer harassment'). All explicitly mentioned aspects are covered despite using different language."
    Pass: true

    Question: "What economic and political factors contributed to the 2008 financial crisis?"
    Answer: "The real estate market collapse after years of high-risk lending practices devastated mortgage-backed securities' value. Wall Street had created intricate derivative products that disguised underlying risk levels, while credit assessment organizations failed in their oversight role. Legislative changes in the financial industry during the 1990s eliminated regulatory guardrails that previously limited excessive leverage and speculation among investment banks."
    Aspects_Expected: "economic factors, political factors"
    Aspects_Provided: "real estate market collapse, high-risk lending, mortgage-backed securities, derivative products, risk disguising, credit assessment failures, legislative changes, regulatory guardrail elimination, leverage, speculation"
    Think: "The question explicitly asks about two categories of factors: economic and political. The answer addresses economic factors ('real estate market collapse', 'high-risk lending', 'mortgage-backed securities', 'derivative products', 'risk disguising', 'credit assessment failures') and political factors ('legislative changes', 'regulatory guardrail elimination'). While using different terminology, the answer covers both explicitly requested aspects."
    Pass: true

    Question: "コロナウイルスの感染拡大が経済、教育システム、および医療インフラにどのような影響を与えましたか？"
    Answer: "コロナウイルスは世界経済に甚大な打撃を与え、多くの企業が倒産し、失業率が急増しました。教育については、遠隔学習への移行が進み、デジタル格差が浮き彫りになりましたが、新しい教育テクノロジーの採用も加速しました。"
    Aspects_Expected: "経済、教育システム、医療インフラ"
    Aspects_Provided: "世界経済、企業倒産、失業率、遠隔学習、デジタル格差、教育テクノロジー"
    Think: "質問では明示的にコロナウイルスの影響の三つの側面について尋ねています：経済、教育システム、医療インフラです。回答は経済（「世界経済」「企業倒産」「失業率」について）と教育システム（「遠隔学習」「デジタル格差」「教育テクノロジー」について）に対応していますが、質問で明示的に求められていた医療インフラへの影響についての議論が完全に省略されています。"
    Pass: false

    Question: "请解释人工智能在医疗诊断、自动驾驶和客户服务方面的应用。"
    Answer: "在医疗领域，AI算法可以分析医学影像以检测癌症和其他疾病，准确率有时甚至超过人类专家。自动驾驶技术利用机器学习处理来自雷达、激光雷达和摄像头的数据，实时做出驾驶决策。在客户服务方面，聊天机器人和智能助手能够处理常见问题，分类客户查询，并在必要时将复杂问题转给人工代表。"
    Aspects_Expected: "医疗诊断、自动驾驶、客户服务"
    Aspects_Provided: "医学影像分析、癌症检测、雷达数据处理、激光雷达数据处理、摄像头数据处理、实时驾驶决策、聊天机器人、智能助手、客户查询分类"
    Think: "问题明确要求解释人工智能在三个领域的应用：医疗诊断、自动驾驶和客户服务。回答虽然使用了不同的术语，但涵盖了所有三个方面：医疗诊断（讨论了'医学影像分析'和'癌症检测'），自动驾驶（包括'雷达数据处理'、'激光雷达数据处理'、'摄像头数据处理'和'实时驾驶决策'），以及客户服务（提到了'聊天机器人'、'智能助手'和'客户查询分类'）。尽管使用了不同的表述，但所有明确提及的方面都得到了全面覆盖。"
    Pass: true

    Question: "Comment les changements climatiques affectent-ils la production agricole, les écosystèmes marins et la santé publique dans les régions côtières?"
    Answer: "Les variations de température et de précipitations modifient les cycles de croissance des cultures et la distribution des ravageurs agricoles, nécessitant des adaptations dans les pratiques de culture. Dans les océans, l'acidification et le réchauffement des eaux entraînent le blanchissement des coraux et la migration des espèces marines vers des latitudes plus froides, perturbant les chaînes alimentaires existantes."
    Aspects_Expected: "production agricole, écosystèmes marins, santé publique"
    Aspects_Provided: "cycles de croissance, distribution des ravageurs, adaptations des pratiques de culture, acidification des océans, réchauffement des eaux, blanchissement des coraux, migration des espèces marines, perturbation des chaînes alimentaires"
    Think: "La question demande explicitement les effets du changement climatique sur trois aspects: la production agricole, les écosystèmes marins et la santé publique dans les régions côtières. La réponse aborde la production agricole (en discutant des 'cycles de croissance', de la 'distribution des ravageurs' et des 'adaptations des pratiques de culture') et les écosystèmes marins (en couvrant 'l'acidification des océans', le 'réchauffement des eaux', le 'blanchissement des coraux', la 'migration des espèces marines' et la 'perturbation des chaînes alimentaires'). Cependant, elle omet complètement toute discussion sur les effets sur la santé publique dans les régions côtières, qui était explicitement demandée dans la question."
    Pass: false
    </examples>

    Now evaluate this pair:
    Question: ${question}
    Answer: ${answer}
  `;
}
