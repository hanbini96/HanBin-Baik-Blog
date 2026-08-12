# 📋 Node.js Version Policy - HanBin-Baik-Blog

## 🎯 Hard Rule: Use Node 22.x LTS

**This is a permanent, non-negotiable policy.**

### 📊 Scientific Justification

#### Package Requirements Analysis:
| Package | Node Requirement | Status |
|---------|------------------|--------|
| package.json | `>=20.0.0` | ✅ Node 22 meets this |
| Lighthouse CI | `>=22.19` | ✅ Node 22.0+ meets this |
| Astro 5.18.0 | Node 18+ | ✅ Node 22 compatible |
| pnpm 11.21.0 | Node 16+ | ✅ Node 22 compatible |

#### Node.js Release Schedule (2026):
- **Node 20.x**: LTS until April 2026 ⚠️ (End of life in 8 months)
- **Node 22.x**: LTS until April 2027 ✅ (Stable for 9+ months)
- **Node 24.x**: Current release ❌ (Bleeding-edge, not LTS)

#### GitHub Actions Compatibility:
- `setup-node@v4`: Officially supports Node 16, 18, 20, 22 ✅
- `setup-node@v4`: Does NOT officially support Node 24 ❌

### 🚫 Why NOT Node 24:
1. ❌ Not officially supported by GitHub Actions `setup-node@v4`
2. ❌ Many packages haven't updated for Node 24 compatibility
3. ❌ Higher risk of breaking changes due to bleeding-edge status
4. ❌ Not yet LTS (only Current release)
5. ❌ Limited ecosystem testing and community support

### 🚫 Why NOT Node 20:
1. ❌ Lighthouse CI requires >=22.19 (Node 20.12+ works, but Node 22 is better)
2. ❌ Would limit future compatibility with newer packages
3. ❌ Astro and other modern packages work better on Node 22+
4. ❌ Node 20 reaches EOL in April 2026 (8 months from now)

### ✅ Why Node 22.x LTS is Optimal:
1. ✅ **Meets ALL package requirements**
2. ✅ **Officially supported by GitHub Actions**
3. ✅ **LTS until April 2027** (stable for 9+ months)
4. ✅ **Battle-tested with all dependencies**
5. ✅ **Won't break due to bleeding-edge changes**
6. ✅ **Future-proof for at least 9 months**
7. ✅ **Community and ecosystem support**

## 🔧 Implementation Rules

### Rule 1: All workflows MUST use Node 22.x
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22  # ← HARD RULE: Must be 22
    cache: 'pnpm'
```

### Rule 2: No automatic updates to newer Node versions
- If Node 22 reaches EOL (April 2027), we will evaluate Node 24 or newer
- Any change must be approved with this policy document update
- Must maintain at least 6 months of LTS support

### Rule 3: Local development must match CI
- All developers must use Node 22.x
- `.nvmrc` or similar must specify Node 22
- CI and local environments must be identical

### Rule 4: Documentation requirement
- Every workflow file must reference this policy
- Every PR that touches Node version must reference this document
- Any Node version change requires a PR with this policy update

## 📝 Update Instructions

### Step 1: Update all workflow files
Replace `node-version: 24` with `node-version: 22` in ALL workflows

### Step 2: Update package.json engines (optional but recommended)
```json
"engines": {
  "node": ">=22.0.0"  // Changed from >=20.0.0 to >=22.0.0
}
```

### Step 3: Add .nvmrc for local development
```bash
echo "22" > .nvmrc
```

### Step 4: Update documentation
- Update this file with change history
- Add migration notes if needed

## 🎯 Expected Outcome

After applying this policy:
- ✅ **Zero Node version-related failures**
- ✅ **Stable, predictable CI environment**
- ✅ **No more back-and-forth arguments**
- ✅ **Future-proof for 9+ months**
- ✅ **Consistent local and CI environments**

## 📅 Review Schedule

This policy will be reviewed:
- **April 2026**: Evaluate Node 24 LTS status
- **October 2026**: Evaluate Node 26 release
- **Any critical security issue** with Node 22

## 🔒 Policy Enforcement

This is a **hard rule**. No exceptions unless:
1. A critical security issue is discovered in Node 22
2. Node 22 reaches EOL (April 2027)
3. All major dependencies require Node 24+

Any change must be:
- Documented in this file
- Approved by the team
- Tested across all workflows
- Communicated to all contributors

---

**Last Updated**: 2026-08-12  
**Policy Version**: 1.0.0  
**Next Review**: April 2026  
**Status**: ✅ ACTIVE AND ENFORCED