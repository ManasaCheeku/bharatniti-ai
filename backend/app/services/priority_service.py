def calculate_priority_score(
    urgency: float,
    infrastructure_gap: float,
    affected_population_factor: float,
    regional_vulnerability: float,
    demand_factor: float = 75.0
) -> float:
    """
    Calculates transparent AI-assisted Development Priority Score (0 - 100).
    
    Formula:
      Priority Score = (Demand * 0.30) + (Urgency * 0.25) + (Infrastructure Gap * 0.20) + 
                       (Affected Population Factor * 0.15) + (Regional Vulnerability * 0.10)
    """
    # Clamp inputs between 0 and 100
    u = max(0.0, min(100.0, float(urgency)))
    g = max(0.0, min(100.0, float(infrastructure_gap)))
    pop = max(0.0, min(100.0, float(affected_population_factor)))
    vuln = max(0.0, min(100.0, float(regional_vulnerability)))
    dem = max(0.0, min(100.0, float(demand_factor)))

    raw_score = (
        (dem * 0.30) +
        (u * 0.25) +
        (g * 0.20) +
        (pop * 0.15) +
        (vuln * 0.10)
    )

    return round(max(0.0, min(100.0, raw_score)), 1)
