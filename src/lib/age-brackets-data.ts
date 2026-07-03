// CPF age bracket data for programmatic SEO pages
// Based on CPF contribution rates from cpf-rates-2026.ts

export interface AgeBracketEntry {
  slug: string;
  label: string;
  ageRange: string;
  cpfEmployeeRate: number;
  cpfEmployerRate: number;
  description: string;
  faqs: { question: string; answer: string }[];
}

export const AGE_BRACKETS: AgeBracketEntry[] = [
  {
    slug: "below-55",
    label: "55 and Below",
    ageRange: "Up to 55 years old",
    cpfEmployeeRate: 20,
    cpfEmployerRate: 17,
    description:
      "The CPF contribution rates for Singapore Citizens and Permanent Residents (3rd year onwards) aged 55 and below are the highest in the entire CPF system, with employees contributing 20% and employers contributing 17% of ordinary wages, for a combined total of 37%. This age bracket covers the vast majority of the working population, from fresh graduates entering the workforce at age 21 to mid-career professionals approaching their mid-fifties. The high contribution rates reflect Singapore's policy of maximising retirement savings during an individual's peak earning years, when income is typically growing and financial obligations such as mortgage payments can be partially funded through CPF's Ordinary Account (OA). For workers aged 35 and below, approximately 62% of total CPF contributions flow into the Ordinary Account, which can be used for housing, education, and investment. About 16% goes to the Special Account (SA) for retirement, and 22% to the MediSave Account (MA) for healthcare. As workers age within this bracket, the allocation gradually shifts: by age 50 to 55, only about 41% goes to OA, while SA receives 27% and MA receives 32%. The impact on take-home pay is significant. For example, a worker earning S$5,000 per month will see S$1,000 deducted for CPF, reducing their cash take-home by 20%. However, the employer's additional 17% contribution (S$850) effectively increases total compensation to S$5,850 — a benefit that is often underappreciated. The CPF Ordinary Wage ceiling of S$6,800 per month means that for salaries above this threshold, CPF is calculated only on the first S$6,800, and the excess flows entirely to cash. This ceiling mechanism ensures that very high earners are not disproportionately affected by CPF deductions while still building substantial retirement savings.",
    faqs: [
      {
        question: "What is the CPF contribution rate for employees aged 55 and below?",
        answer:
          "For Singapore Citizens and PRs (3rd year onwards) aged 55 and below, the employee CPF contribution rate is 20% and the employer rate is 17%, giving a combined total of 37% of ordinary wages. CPF is calculated on wages up to the Ordinary Wage ceiling of S$6,800 per month.",
      },
      {
        question: "How is CPF allocated for workers aged 55 and below?",
        answer:
          "For workers aged 35 and below, approximately 62% of total CPF goes to the Ordinary Account (OA), 16% to the Special Account (SA), and 22% to the MediSave Account (MA). The OA proportion decreases with age — by 50 to 55, it is about 41% OA, 27% SA, and 32% MA — as more is directed to retirement and healthcare savings.",
      },
      {
        question: "Does the 20% CPF rate apply to my entire salary?",
        answer:
          "No. CPF is calculated on the lower of your actual ordinary wages or the OW ceiling of S$6,800 per month. If you earn S$10,000, CPF is calculated on S$6,800 only. The remaining S$3,200 is not subject to CPF and goes directly to your take-home pay. The maximum monthly employee CPF deduction is therefore S$1,360 (20% of S$6,800).",
      },
    ],
  },
  {
    slug: "55-60",
    label: "55 to 60",
    ageRange: "Above 55 to 60 years old",
    cpfEmployeeRate: 15,
    cpfEmployerRate: 15,
    description:
      "The CPF contribution rates for Singapore Citizens and Permanent Residents (3rd year onwards) aged above 55 to 60 drop to 15% for both employee and employer, for a combined total of 30%. This represents a significant reduction from the 37% total rate that applied before age 55, and it marks the beginning of a graduated step-down designed to help older workers maintain higher take-home pay as they approach retirement. The reduction in employee contribution from 20% to 15% translates to an immediate 5 percentage point increase in take-home pay. For a worker earning S$5,000 per month, this means S$250 more in monthly cash — S$750 in CPF deduction instead of S$1,000. While this boosts disposable income, it also means slower CPF accumulation during a period when many workers are making final preparations for retirement. The CPF allocation at this age bracket shifts substantially. Approximately 47% of total contributions go to the Ordinary Account, only 13% to the Special Account, and a significant 40% to the MediSave Account. This heavy MediSave allocation reflects the increasing healthcare needs and costs associated with ageing. By this stage, many workers have already drawn down their OA for housing, and the SA is being preserved for the CPF LIFE retirement payout scheme. The age of 55 is particularly significant in the CPF system because it is when the Retirement Account (RA) is created. At age 55, the CPF Board transfers savings from the SA and OA (in that order) into the RA up to the Full Retirement Sum (FRS), which is S$205,800 for members turning 55 in 2025. This FRS determines the monthly payouts under CPF LIFE from age 65 onwards. Workers in this bracket should carefully consider their CPF balances and whether to top up their RA to achieve higher retirement payouts.",
    faqs: [
      {
        question: "What are the CPF rates for workers aged 55 to 60?",
        answer:
          "For Singapore Citizens and PRs (3rd year onwards) aged above 55 to 60, the employee CPF contribution rate is 15% and the employer rate is also 15%, giving a combined total of 30%. This is a reduction from the 37% total rate for workers aged 55 and below.",
      },
      {
        question: "How much more take-home pay do I get after age 55?",
        answer:
          "The employee CPF rate drops from 20% to 15% at age 55, giving you an additional 5% of your wage as cash. On a S$6,000 salary, this means S$300 more per month in take-home pay. However, the employer rate also drops from 17% to 15%, reducing total CPF accumulation from 37% to 30%.",
      },
      {
        question: "What happens to my CPF at age 55?",
        answer:
          "At age 55, a Retirement Account (RA) is created. CPF transfers savings from your Special Account and Ordinary Account (in that order) into the RA up to the Full Retirement Sum (FRS). The FRS determines your CPF LIFE monthly payouts starting from age 65. Any OA balance above the FRS can be withdrawn in cash.",
      },
    ],
  },
  {
    slug: "60-65",
    label: "60 to 65",
    ageRange: "Above 60 to 65 years old",
    cpfEmployeeRate: 9.5,
    cpfEmployerRate: 11.5,
    description:
      "The CPF contribution rates for Singapore Citizens and Permanent Residents (3rd year onwards) aged above 60 to 65 are 9.5% for the employee and 11.5% for the employer, giving a combined total of 21%. This represents another significant step down from the 30% total for the 55-to-60 bracket, further boosting take-home pay for older workers who choose to continue employment. At this stage, the employee contribution of 9.5% is less than half the 20% rate that applies to workers aged 55 and below, meaning take-home pay is substantially higher as a proportion of gross salary. For a worker earning S$5,000 per month, the CPF deduction is only S$475 compared to S$1,000 for a younger colleague, resulting in S$525 more in monthly cash. The CPF allocation at this age bracket is heavily weighted towards MediSave. Approximately 14% goes to the Ordinary Account, only about 10% to the Special Account, and a dominant 76% to the MediSave Account. This allocation structure recognises that workers in their early sixties are approaching or have reached the age where healthcare costs become a primary financial concern, and MediSave provides a dedicated pool of funds for hospitalisation, outpatient treatments, and MediShield Life premiums. Singapore's re-employment legislation requires employers to offer re-employment to eligible employees up to age 63 (increasing to 65 in the coming years under the Retirement and Re-employment Act). Many workers in this bracket are in re-employment contracts, which may involve adjusted job scopes and salaries. The reduced CPF rates help make continued employment financially viable for both employers and employees. The employer contribution of 11.5% is lower than the 15% for the 55-to-60 bracket, reducing the total cost of employing older workers. This policy design is part of Singapore's broader strategy to encourage labour force participation among older residents, addressing the challenges of an ageing population while providing flexible options for those who wish to continue working.",
    faqs: [
      {
        question: "What CPF rates apply to workers aged 60 to 65?",
        answer:
          "For Singapore Citizens and PRs (3rd year onwards) aged above 60 to 65, the employee CPF rate is 9.5% and the employer rate is 11.5%, for a total of 21%. This is a reduction from the 30% total for ages 55-60 and the 37% for ages 55 and below.",
      },
      {
        question: "Why does most of my CPF go to MediSave at this age?",
        answer:
          "At age 60 to 65, approximately 76% of total CPF contributions are allocated to MediSave. This reflects the increased healthcare needs associated with ageing. MediSave funds can be used for hospitalisation, approved outpatient treatments, MediShield Life premiums, and certain chronic disease management programmes.",
      },
      {
        question: "Can I still use CPF for housing at age 60 to 65?",
        answer:
          "While CPF OA contributions continue at this age (approximately 14% of total CPF), the amounts are small. Most workers at this stage have already paid off their HDB loans or are close to doing so. Any remaining OA balance can still be used for housing, but new loan drawdowns from CPF OA are subject to age-related limits.",
      },
    ],
  },
  {
    slug: "65-70",
    label: "65 to 70",
    ageRange: "Above 65 to 70 years old",
    cpfEmployeeRate: 7,
    cpfEmployerRate: 9,
    description:
      "The CPF contribution rates for Singapore Citizens and Permanent Residents (3rd year onwards) aged above 65 to 70 are 7% for the employee and 9% for the employer, giving a combined total of 16%. This is a further reduction from the 21% total for the 60-to-65 bracket. At this stage, many workers have reached the statutory retirement age and are either in re-employment arrangements, working part-time, or engaged in consultancy and advisory roles. The reduced CPF contribution rate of 7% means that take-home pay is very close to gross salary — for a worker earning S$5,000 per month, only S$350 is deducted for CPF, leaving S$4,650 before tax. The CPF allocation at this age bracket is almost entirely directed to MediSave. Approximately 87.5% of total CPF contributions flow to the MediSave Account, with only 6.25% each going to the Ordinary Account and Special Account. This extreme MediSave weighting ensures that older workers build up healthcare reserves during a period when medical expenses are likely to increase significantly. The MediSave Account has its own balance limit (the Basic Healthcare Sum), which is S$71,500 for those turning 65 in 2025. Once the MediSave balance reaches this cap, any excess MediSave contributions are transferred to the Retirement Account or refunded. Workers in this age bracket may also be receiving CPF LIFE payouts, which typically commence between ages 65 and 70 depending on when they chose to start. These monthly CPF LIFE payouts provide a base retirement income that supplements employment income or other savings. The combination of reduced CPF deductions, CPF LIFE payouts, and potentially accumulated personal savings means that workers aged 65 to 70 can enjoy a reasonable standard of living. Singapore's policies actively encourage continued labour force participation at this age, recognising the social and economic benefits of keeping older workers engaged and productive in the economy.",
    faqs: [
      {
        question: "What are the CPF rates for workers aged 65 to 70?",
        answer:
          "For Singapore Citizens and PRs (3rd year onwards) aged above 65 to 70, the employee CPF rate is 7% and the employer rate is 9%, for a total of 16%. This is significantly lower than the 37% total for workers aged 55 and below, resulting in much higher take-home pay as a proportion of gross salary.",
      },
      {
        question: "Where does my CPF go at age 65 to 70?",
        answer:
          "At this age, approximately 87.5% of total CPF contributions go to the MediSave Account, with only 6.25% each to the Ordinary Account and Special Account. The heavy MediSave allocation ensures adequate healthcare funding during a period of increased medical needs.",
      },
      {
        question: "Can I receive CPF LIFE payouts while still working?",
        answer:
          "Yes. CPF LIFE payouts can begin from age 65 and are not affected by employment status. If you are still working and contributing to CPF, your CPF contributions and CPF LIFE payouts operate independently. You receive your CPF LIFE monthly payout while your employer continues to make CPF contributions on your wages.",
      },
    ],
  },
  {
    slug: "above-70",
    label: "Above 70",
    ageRange: "Above 70 years old",
    cpfEmployeeRate: 5,
    cpfEmployerRate: 7.5,
    description:
      "The CPF contribution rates for Singapore Citizens and Permanent Residents (3rd year onwards) aged above 70 are the lowest in the CPF system, with employees contributing 5% and employers contributing 7.5% for a combined total of 12.5%. This minimal contribution rate reflects the policy objective of maximising take-home pay for workers who continue employment well past the traditional retirement age, while still maintaining a modest level of healthcare savings through MediSave. For a worker earning S$5,000 per month at age 71 or above, only S$250 is deducted for CPF, leaving S$4,750 before tax — the highest take-home proportion of any age bracket. The CPF allocation at this age is overwhelmingly directed to MediSave, with approximately 88% of total contributions going to the MediSave Account, 8% to the Ordinary Account, and 4% to the Special Account. This near-total MediSave allocation ensures that any CPF savings made at this late stage are immediately available for healthcare expenses, which are statistically the highest during this period of life. Workers above 70 who continue in employment are typically engaged in specialised advisory roles, consultancy, mentoring, part-time work, or roles that leverage their extensive experience and institutional knowledge. Singapore's Silver Support Scheme, Workfare Income Supplement, and other social support programmes may also supplement the income of lower-wage older workers. The combination of minimal CPF deductions, CPF LIFE payouts (which most individuals at this age would be receiving), personal savings, and potentially income from property or investments means that the 5% CPF employee contribution has a relatively small impact on overall financial well-being. Nevertheless, the continued CPF contributions serve an important purpose by topping up MediSave for healthcare security, particularly for hospitalisation costs and chronic disease management that become more prevalent with age.",
    faqs: [
      {
        question: "What are the CPF rates for workers above 70?",
        answer:
          "For Singapore Citizens and PRs (3rd year onwards) above age 70, the employee CPF rate is 5% and the employer rate is 7.5%, for a combined total of 12.5%. These are the lowest CPF rates, ensuring maximum take-home pay for elderly workers while maintaining basic MediSave contributions.",
      },
      {
        question: "Is it worth working past 70 in Singapore from a CPF perspective?",
        answer:
          "From a CPF perspective, working past 70 involves minimal CPF deductions (5% employee) while the employer still contributes 7.5%. Since most contributions go to MediSave, this helps cover healthcare costs. The low deduction rate means nearly all earnings go to take-home pay. Combined with CPF LIFE payouts, continued employment at this age provides a strong overall income position.",
      },
      {
        question: "Do CPF LIFE payouts continue for workers above 70?",
        answer:
          "Yes. CPF LIFE provides monthly payouts for life once commenced, regardless of age or employment status. Workers above 70 who are still employed will receive both their salary (with 5% CPF deduction) and their CPF LIFE monthly payout simultaneously. The two income streams are independent of each other.",
      },
    ],
  },
  {
    slug: "foreigner-ep",
    label: "Foreigner / EP Holder",
    ageRange: "Any age (non-resident for CPF)",
    cpfEmployeeRate: 0,
    cpfEmployerRate: 0,
    description:
      "Foreign professionals working in Singapore on an Employment Pass (EP), S Pass, or other work passes are not required to make CPF contributions, and their employers are likewise not obligated to contribute to CPF on their behalf. This means that the entire gross salary — subject only to income tax — flows directly to the employee as take-home pay. For foreigners, the gross-to-net calculation is considerably simpler than for Singapore Citizens and Permanent Residents: the only deduction is income tax. However, the absence of CPF also means that foreign workers miss out on the employer's CPF contribution, which for citizens and established PRs represents an additional 17% of ordinary wages (up to the S$6,800 ceiling). This effectively makes the total compensation package for a foreigner lower than that of a citizen earning the same gross salary — by up to S$1,156 per month. The income tax treatment for foreigners depends on their tax residency status. Tax residents (those who have been in Singapore for at least 183 days in a calendar year, or who have a permanent home or employment contract in Singapore) are taxed on the same progressive scale as citizens, with rates ranging from 0% to 24%. Non-tax-residents are subject to a flat rate of 15% on employment income, or the progressive resident rate, whichever produces a higher tax — and they are not eligible for personal tax reliefs or deductions. For foreign professionals considering a move to Singapore, the lack of CPF can be viewed both as an advantage and a disadvantage. On the positive side, take-home pay is higher in cash terms since there is no 20% CPF deduction. However, this means foreigners must independently plan for retirement savings, housing, and healthcare — costs that CPF partially addresses for citizens and PRs. Many employers offer compensation packages for EP holders that include housing allowances, medical insurance, and annual flights home, which partially offset the lack of CPF benefits. Understanding the full picture of employment as a foreigner in Singapore requires considering not just the salary and tax, but also the cost of private health insurance (S$200 to S$500+ per month), rental accommodation (Singapore's most significant expense for foreigners), and retirement savings contributions to home-country pension systems or private investment vehicles.",
    faqs: [
      {
        question: "Do foreigners on Employment Pass pay CPF in Singapore?",
        answer:
          "No. Foreign workers on Employment Passes, S Passes, and other work permits are exempt from CPF contributions. Neither the employee nor the employer makes CPF contributions. The entire gross salary, less income tax, becomes the employee's take-home pay. This applies regardless of the foreigner's age or salary level.",
      },
      {
        question: "How are foreigners taxed on salary in Singapore?",
        answer:
          "Tax-resident foreigners (in Singapore for 183+ days per year) are taxed on the same progressive scale as citizens, from 0% to 24%. Non-tax-residents pay a flat 15% on employment income, or the progressive rate, whichever is higher. Non-residents cannot claim personal tax reliefs. Most EP holders on multi-year contracts qualify as tax residents.",
      },
      {
        question: "Is the total compensation lower for foreigners compared to citizens?",
        answer:
          "In pure dollar terms, yes. A citizen earning S$6,800 per month receives an additional S$1,156 per month in employer CPF contributions (17%), bringing total compensation to S$7,956. A foreigner on the same gross salary receives only S$6,800 with no employer CPF. However, foreigners have higher cash take-home since there is no 20% employee CPF deduction. Many employers offset this gap with housing allowances and benefits.",
      },
    ],
  },
];
